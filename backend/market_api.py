"""Client for market.csgo.com API v2."""

import time
import httpx
from config import MARKET_API_KEY, MARKET_BASE_URL

_price_cache: dict = {}
_price_cache_time: float = 0
CACHE_TTL = 300


async def fetch_prices(currency: str = "RUB") -> dict:
    """Fetch price list from market.csgo.com. Public endpoint, no key needed."""
    global _price_cache, _price_cache_time

    if _price_cache and (time.time() - _price_cache_time) < CACHE_TTL:
        return _price_cache

    url = f"{MARKET_BASE_URL}/prices/{currency}.json"
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    if data.get("success"):
        prices = {}
        for item in data.get("items", []):
            name = item.get("market_hash_name", "")
            if name:
                prices[name] = {
                    "price": item.get("price"),
                    "avg_price": item.get("avg_price"),
                    "popularity": item.get("popularity_7d"),
                }
        _price_cache = prices
        _price_cache_time = time.time()
        return prices

    return _price_cache


async def get_balance() -> dict:
    """Get account balance. Requires API key."""
    if not MARKET_API_KEY:
        return {"error": "API key not configured", "balance": 0}

    url = f"{MARKET_BASE_URL}/get-money"
    params = {"key": MARKET_API_KEY}
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


async def buy_item(market_hash_name: str, max_price: int, custom_id: str = "") -> dict:
    """
    Buy an item from market.csgo.com.
    price is in kopecks (1 RUB = 100).
    """
    if not MARKET_API_KEY:
        return {"success": False, "error": "API key not configured"}

    url = f"{MARKET_BASE_URL}/buy"
    params = {
        "key": MARKET_API_KEY,
        "hash_name": market_hash_name,
        "price": max_price,
        "currency": "RUB",
    }
    if custom_id:
        params["custom_id"] = custom_id

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


async def buy_item_for_user(
    market_hash_name: str, max_price: int, trade_token: str, partner: str, custom_id: str = ""
) -> dict:
    """
    Buy an item and send directly to user's Steam account.
    Uses buy-for endpoint.
    """
    if not MARKET_API_KEY:
        return {"success": False, "error": "API key not configured"}

    url = f"{MARKET_BASE_URL}/buy-for"
    params = {
        "key": MARKET_API_KEY,
        "hash_name": market_hash_name,
        "price": max_price,
        "currency": "RUB",
        "token": trade_token,
        "partner": partner,
    }
    if custom_id:
        params["custom_id"] = custom_id

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


async def get_buy_status(custom_id: str) -> dict:
    """Check purchase status by custom_id."""
    if not MARKET_API_KEY:
        return {"success": False, "error": "API key not configured"}

    url = f"{MARKET_BASE_URL}/get-buy-info-by-custom-id"
    params = {"key": MARKET_API_KEY, "custom_id": custom_id}
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()


async def search_item(market_hash_name: str) -> dict:
    """Search for an item by hash name to get available listings."""
    if not MARKET_API_KEY:
        return {"success": False, "error": "API key not configured"}

    url = f"{MARKET_BASE_URL}/search-item-by-hash-name"
    params = {"key": MARKET_API_KEY, "hash_name": market_hash_name}
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        return resp.json()
