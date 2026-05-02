"""JWT authentication utilities."""

import os
import time
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "cs2skins-secret-change-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: int, username: str) -> str:
    payload = {
        "sub": user_id,
        "username": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Токен истёк")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Невалидный токен")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Требуется авторизация")

    payload = decode_token(credentials.credentials)
    from database import get_user_by_id

    user = get_user_by_id(payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return user


async def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict | None:
    if not credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        from database import get_user_by_id
        return get_user_by_id(payload["sub"])
    except HTTPException:
        return None
