import os
from dotenv import load_dotenv

load_dotenv()

MARKET_API_KEY = os.getenv("MARKET_CSGO_API_KEY", "")
MARKET_BASE_URL = "https://market.csgo.com/api/v2"
STEAM_CDN_IMAGE_URL = "https://api.steamapis.com/image/item/730"
PRICE_CACHE_TTL = 300  # 5 minutes
