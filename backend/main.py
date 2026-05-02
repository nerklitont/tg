"""FastAPI backend for CS2 Skins case opening site."""

import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import market_api
from config import MARKET_API_KEY, STEAM_CDN_IMAGE_URL
from skins_data import ALL_SKINS, CASES, RARITY_NAMES_RU, RARITY_ORDER

app = FastAPI(title="CS2 Skins API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).parent.parent


def build_image_url(market_hash_name: str) -> str:
    """Build Steam CDN image URL for a skin."""
    return f"{STEAM_CDN_IMAGE_URL}/{market_hash_name}"


def enrich_skin(skin: dict, prices: dict | None = None) -> dict:
    """Add image URL and real price to skin data."""
    mhn = skin["market_hash_name"]
    result = {
        **skin,
        "image": build_image_url(mhn),
        "rarity_name": RARITY_NAMES_RU.get(skin["rarity"], skin["rarity"]),
    }
    if prices and mhn in prices:
        p = prices[mhn]
        if p.get("price"):
            result["real_price"] = p["price"]
        if p.get("avg_price"):
            result["avg_price"] = p["avg_price"]
    return result


# ──────────────────────────── API Routes ────────────────────────────


@app.get("/api/skins")
async def get_skins():
    """Return all skins with images and real prices from market.csgo.com."""
    try:
        prices = await market_api.fetch_prices()
    except Exception:
        prices = {}

    skins = [enrich_skin(s, prices) for s in ALL_SKINS]
    return {"success": True, "skins": skins, "has_prices": bool(prices)}


@app.get("/api/cases")
async def get_cases():
    """Return all available cases."""
    try:
        prices = await market_api.fetch_prices()
    except Exception:
        prices = {}

    cases_out = []
    for case in CASES:
        case_skins = []
        for sid in case["skins"]:
            skin = next((s for s in ALL_SKINS if s["id"] == sid), None)
            if skin:
                case_skins.append(enrich_skin(skin, prices))

        cases_out.append({
            **case,
            "skin_details": case_skins,
        })

    return {"success": True, "cases": cases_out, "has_prices": bool(prices)}


@app.get("/api/prices")
async def get_prices():
    """Get current prices from market.csgo.com."""
    try:
        prices = await market_api.fetch_prices()
        return {"success": True, "prices": prices, "count": len(prices)}
    except Exception as e:
        return {"success": False, "error": str(e), "prices": {}}


@app.get("/api/status")
async def get_status():
    """Check API status and whether market key is configured."""
    has_key = bool(MARKET_API_KEY)
    balance = None
    if has_key:
        try:
            balance = await market_api.get_balance()
        except Exception:
            pass

    return {
        "success": True,
        "api_key_configured": has_key,
        "balance": balance,
        "skins_count": len(ALL_SKINS),
        "cases_count": len(CASES),
    }


class WithdrawRequest(BaseModel):
    market_hash_name: str
    max_price: int
    trade_token: str
    partner: str


@app.post("/api/withdraw")
async def withdraw_skin(req: WithdrawRequest):
    """
    Buy a skin from market.csgo.com and send to user's Steam account.
    Requires MARKET_CSGO_API_KEY to be configured.
    """
    if not MARKET_API_KEY:
        raise HTTPException(status_code=503, detail="API key not configured. Withdrawal is disabled.")

    custom_id = f"cs2skins-{uuid.uuid4().hex[:12]}"

    try:
        result = await market_api.buy_item_for_user(
            market_hash_name=req.market_hash_name,
            max_price=req.max_price,
            trade_token=req.trade_token,
            partner=req.partner,
            custom_id=custom_id,
        )
        return {
            "success": result.get("success", False),
            "custom_id": custom_id,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/withdraw/status/{custom_id}")
async def withdraw_status(custom_id: str):
    """Check withdrawal status."""
    if not MARKET_API_KEY:
        raise HTTPException(status_code=503, detail="API key not configured.")

    try:
        result = await market_api.get_buy_status(custom_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/search/{market_hash_name}")
async def search_item(market_hash_name: str):
    """Search for available listings of a specific item."""
    if not MARKET_API_KEY:
        raise HTTPException(status_code=503, detail="API key not configured.")

    try:
        result = await market_api.search_item(market_hash_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ──────────────── Serve Frontend Static Files ────────────────

app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR / "js")), name="js")


@app.get("/")
async def serve_index():
    return FileResponse(str(FRONTEND_DIR / "index.html"))


@app.get("/{path:path}")
async def serve_static(path: str):
    file_path = FRONTEND_DIR / path
    if file_path.is_file():
        return FileResponse(str(file_path))
    return FileResponse(str(FRONTEND_DIR / "index.html"))
