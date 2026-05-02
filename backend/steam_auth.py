"""Steam OpenID 2.0 authentication."""

import re
from urllib.parse import urlencode

import httpx


STEAM_OPENID_URL = "https://steamcommunity.com/openid/login"
STEAM_PROFILE_URL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"


def get_steam_login_url(return_url: str) -> str:
    """Build the Steam OpenID login URL."""
    params = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": return_url,
        "openid.realm": return_url.rsplit("/", 1)[0] + "/",
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    }
    return STEAM_OPENID_URL + "?" + urlencode(params)


async def validate_steam_login(params: dict) -> str | None:
    """
    Validate the Steam OpenID response.
    Returns steam_id (str) if valid, None otherwise.
    """
    validation_params = dict(params)
    validation_params["openid.mode"] = "check_authentication"

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(STEAM_OPENID_URL, data=validation_params)

    if "is_valid:true" not in resp.text:
        return None

    # Extract Steam ID from claimed_id
    claimed_id = params.get("openid.claimed_id", "")
    match = re.search(r"(\d{17})$", claimed_id)
    if not match:
        return None

    return match.group(1)


async def get_steam_user_info(steam_id: str, api_key: str = "") -> dict:
    """
    Fetch Steam user profile info.
    Works without API key (limited info) or with key (full info).
    """
    if api_key:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                STEAM_PROFILE_URL,
                params={"key": api_key, "steamids": steam_id},
            )
            data = resp.json()
            players = data.get("response", {}).get("players", [])
            if players:
                return players[0]

    # Fallback: return basic info
    return {
        "steamid": steam_id,
        "personaname": f"Steam_{steam_id[-4:]}",
        "avatarfull": f"https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    }
