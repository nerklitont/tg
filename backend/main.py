"""FastAPI backend for CS2 Skins case opening site."""

import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import market_api
import database as db
import steam_auth
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_optional_user,
)
from config import MARKET_API_KEY, STEAM_CDN_IMAGE_URL
from skins_data import ALL_SKINS, CASES, RARITY_NAMES_RU

import os
STEAM_API_KEY = os.getenv("STEAM_API_KEY", "")

app = FastAPI(title="CS2 Skins API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).parent.parent


@app.on_event("startup")
def startup():
    db.init_db()


def build_image_url(market_hash_name: str) -> str:
    return f"{STEAM_CDN_IMAGE_URL}/{market_hash_name}"


def enrich_skin(skin: dict, prices: dict | None = None) -> dict:
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


def safe_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "username": user["username"],
        "email": user.get("email", ""),
        "balance": user["balance"],
        "trade_token": user.get("trade_token", ""),
        "steam_partner": user.get("steam_partner", ""),
        "steam_id": user.get("steam_id", ""),
        "steam_avatar": user.get("steam_avatar", ""),
        "created_at": user.get("created_at", ""),
    }


# ──────────────────────────── Auth Routes ────────────────────────────

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    email: str
    password: str = Field(min_length=6)


class LoginRequest(BaseModel):
    login: str  # username or email
    password: str


@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    if db.get_user_by_username(req.username):
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")
    if db.get_user_by_email(req.email):
        raise HTTPException(status_code=400, detail="Email уже используется")

    pw_hash = hash_password(req.password)
    user = db.create_user(req.username, req.email, pw_hash)
    if not user:
        raise HTTPException(status_code=500, detail="Ошибка создания аккаунта")

    token = create_access_token(user["id"], user["username"])
    return {
        "success": True,
        "token": token,
        "user": safe_user(user),
    }


@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = db.get_user_by_username(req.login) or db.get_user_by_email(req.login)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    token = create_access_token(user["id"], user["username"])
    return {
        "success": True,
        "token": token,
        "user": safe_user(user),
    }


@app.get("/api/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    inventory = db.get_inventory(user["id"])
    return {
        "success": True,
        "user": safe_user(user),
        "inventory_count": len(inventory),
    }


# ──────────────── Steam Auth ────────────────

@app.get("/api/auth/steam")
async def steam_login(request: Request):
    """Redirect user to Steam login page."""
    base_url = str(request.base_url).rstrip("/")
    return_url = f"{base_url}/api/auth/steam/callback"
    login_url = steam_auth.get_steam_login_url(return_url)
    return {"success": True, "url": login_url}


@app.get("/api/auth/steam/callback")
async def steam_callback(request: Request):
    """Handle Steam OpenID callback."""
    params = dict(request.query_params)
    steam_id = await steam_auth.validate_steam_login(params)
    if not steam_id:
        return RedirectResponse("/?auth_error=steam_validation_failed")

    # Get Steam profile
    profile = await steam_auth.get_steam_user_info(steam_id, STEAM_API_KEY)
    username = profile.get("personaname", f"Steam_{steam_id[-4:]}")
    avatar = profile.get("avatarfull", "")

    # Find or create user
    user = db.get_user_by_steam_id(steam_id)
    if not user:
        user = db.create_steam_user(steam_id, username, avatar)
    else:
        db.update_steam_profile(user["id"], username, avatar)
        user = db.get_user_by_id(user["id"])

    token = create_access_token(user["id"], user["username"])

    # Redirect back to frontend with token
    return RedirectResponse(f"/?token={token}")


# ──────────────── User Balance & Inventory ────────────────

@app.get("/api/user/balance")
async def get_user_balance(user: dict = Depends(get_current_user)):
    return {"success": True, "balance": user["balance"]}


@app.post("/api/user/add-balance")
async def add_balance(user: dict = Depends(get_current_user)):
    new_balance = db.update_balance(user["id"], 5000, "Пополнение баланса")
    return {"success": True, "balance": new_balance}


@app.get("/api/user/inventory")
async def get_user_inventory(user: dict = Depends(get_current_user)):
    items = db.get_inventory(user["id"])
    for item in items:
        item["image"] = build_image_url(item.get("market_hash_name", ""))
    return {"success": True, "items": items, "count": len(items)}


class AddToInventoryRequest(BaseModel):
    skin_id: int
    market_hash_name: str = ""
    name: str
    weapon: str
    rarity: str
    price: float


@app.post("/api/user/inventory/add")
async def add_inventory_item(req: AddToInventoryRequest, user: dict = Depends(get_current_user)):
    skin = {
        "id": req.skin_id,
        "market_hash_name": req.market_hash_name,
        "name": req.name,
        "weapon": req.weapon,
        "rarity": req.rarity,
        "price": req.price,
    }
    inv_id = db.add_to_inventory(user["id"], skin)
    return {"success": True, "inventory_id": inv_id}


@app.post("/api/user/inventory/sell/{inv_id}")
async def sell_inventory_item(inv_id: int, user: dict = Depends(get_current_user)):
    result = db.sell_skin(user["id"], inv_id)
    if not result:
        raise HTTPException(status_code=404, detail="Предмет не найден")
    return {"success": True, **result}


@app.post("/api/user/inventory/sell-all")
async def sell_all_items(user: dict = Depends(get_current_user)):
    result = db.sell_all(user["id"])
    return {"success": True, **result}


class SpendBalanceRequest(BaseModel):
    amount: float
    description: str = ""


@app.post("/api/user/spend")
async def spend_balance(req: SpendBalanceRequest, user: dict = Depends(get_current_user)):
    if user["balance"] < req.amount:
        raise HTTPException(status_code=400, detail="Недостаточно средств")
    new_balance = db.update_balance(user["id"], -req.amount, req.description)
    return {"success": True, "balance": new_balance}


class TradeInfoRequest(BaseModel):
    trade_token: str
    steam_partner: str


@app.post("/api/user/trade-info")
async def update_trade_info(req: TradeInfoRequest, user: dict = Depends(get_current_user)):
    db.update_trade_info(user["id"], req.trade_token, req.steam_partner)
    return {"success": True}


@app.get("/api/user/history")
async def get_history(user: dict = Depends(get_current_user)):
    txs = db.get_transactions(user["id"])
    return {"success": True, "transactions": txs}


# ──────────────────────────── Skins & Cases ────────────────────────────

@app.get("/api/skins")
async def get_skins():
    try:
        prices = await market_api.fetch_prices()
    except Exception:
        prices = {}
    skins = [enrich_skin(s, prices) for s in ALL_SKINS]
    return {"success": True, "skins": skins, "has_prices": bool(prices)}


@app.get("/api/cases")
async def get_cases():
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
        cases_out.append({**case, "skin_details": case_skins})
    return {"success": True, "cases": cases_out, "has_prices": bool(prices)}


@app.get("/api/prices")
async def get_prices():
    try:
        prices = await market_api.fetch_prices()
        return {"success": True, "prices": prices, "count": len(prices)}
    except Exception as e:
        return {"success": False, "error": str(e), "prices": {}}


@app.get("/api/status")
async def get_status():
    has_key = bool(MARKET_API_KEY)
    return {
        "success": True,
        "api_key_configured": has_key,
        "skins_count": len(ALL_SKINS),
        "cases_count": len(CASES),
    }


# ──────────────────────────── Withdrawal ────────────────────────────

class WithdrawRequest(BaseModel):
    market_hash_name: str
    max_price: int
    inv_id: int = 0


@app.post("/api/withdraw")
async def withdraw_skin(req: WithdrawRequest, user: dict = Depends(get_current_user)):
    if not MARKET_API_KEY:
        raise HTTPException(status_code=503, detail="API key not configured. Withdrawal is disabled.")

    trade_token = user.get("trade_token", "")
    partner = user.get("steam_partner", "")
    if not trade_token or not partner:
        raise HTTPException(status_code=400, detail="Укажите Trade Token и Partner ID в настройках профиля")

    custom_id = f"cs2skins-{uuid.uuid4().hex[:12]}"

    try:
        result = await market_api.buy_item_for_user(
            market_hash_name=req.market_hash_name,
            max_price=req.max_price,
            trade_token=trade_token,
            partner=partner,
            custom_id=custom_id,
        )

        if result.get("success") and req.inv_id:
            db.remove_from_inventory(user["id"], req.inv_id)

        return {"success": result.get("success", False), "custom_id": custom_id, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/withdraw/status/{custom_id}")
async def withdraw_status(custom_id: str, user: dict = Depends(get_current_user)):
    if not MARKET_API_KEY:
        raise HTTPException(status_code=503, detail="API key not configured.")
    try:
        return await market_api.get_buy_status(custom_id)
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
