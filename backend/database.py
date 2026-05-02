"""SQLite database for users, balances, and inventories."""

import sqlite3
import json
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "cs2skins.db"


def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT DEFAULT '',
            password_hash TEXT DEFAULT '',
            steam_id TEXT DEFAULT '',
            steam_avatar TEXT DEFAULT '',
            balance REAL DEFAULT 10000.0,
            trade_token TEXT DEFAULT '',
            steam_partner TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            skin_id INTEGER NOT NULL,
            market_hash_name TEXT NOT NULL,
            name TEXT NOT NULL,
            weapon TEXT NOT NULL,
            rarity TEXT NOT NULL,
            price REAL NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    conn.commit()
    conn.close()


# ── User Operations ──

def create_user(username: str, email: str, password_hash: str) -> dict | None:
    conn = get_db()
    try:
        cursor = conn.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, password_hash),
        )
        conn.commit()
        user_id = cursor.lastrowid
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()


def get_user_by_id(user_id: int) -> dict | None:
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_by_username(username: str) -> dict | None:
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_by_email(email: str) -> dict | None:
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE email = ? AND email != ''", (email,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_by_steam_id(steam_id: str) -> dict | None:
    conn = get_db()
    row = conn.execute("SELECT * FROM users WHERE steam_id = ?", (steam_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def create_steam_user(steam_id: str, username: str, avatar: str = "") -> dict | None:
    conn = get_db()
    # Ensure unique username
    base_username = username
    counter = 1
    while True:
        existing = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
        if not existing:
            break
        username = f"{base_username}_{counter}"
        counter += 1

    try:
        cursor = conn.execute(
            "INSERT INTO users (username, steam_id, steam_avatar) VALUES (?, ?, ?)",
            (username, steam_id, avatar),
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return get_user_by_id(user_id)
    except sqlite3.IntegrityError:
        conn.close()
        return None


def update_steam_profile(user_id: int, username: str, avatar: str):
    conn = get_db()
    conn.execute(
        "UPDATE users SET steam_avatar = ? WHERE id = ?",
        (avatar, user_id),
    )
    conn.commit()
    conn.close()


def update_balance(user_id: int, amount: float, description: str = "") -> float:
    conn = get_db()
    conn.execute("UPDATE users SET balance = balance + ? WHERE id = ?", (amount, user_id))
    conn.execute(
        "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)",
        (user_id, "credit" if amount > 0 else "debit", abs(amount), description),
    )
    conn.commit()
    row = conn.execute("SELECT balance FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return row["balance"] if row else 0


def get_balance(user_id: int) -> float:
    conn = get_db()
    row = conn.execute("SELECT balance FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return row["balance"] if row else 0


def update_trade_info(user_id: int, trade_token: str, steam_partner: str):
    conn = get_db()
    conn.execute(
        "UPDATE users SET trade_token = ?, steam_partner = ? WHERE id = ?",
        (trade_token, steam_partner, user_id),
    )
    conn.commit()
    conn.close()


# ── Inventory Operations ──

def add_to_inventory(user_id: int, skin: dict) -> int:
    conn = get_db()
    cursor = conn.execute(
        """INSERT INTO inventory (user_id, skin_id, market_hash_name, name, weapon, rarity, price)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (user_id, skin["id"], skin.get("market_hash_name", ""), skin["name"],
         skin["weapon"], skin["rarity"], skin["price"]),
    )
    conn.commit()
    inv_id = cursor.lastrowid
    conn.close()
    return inv_id


def remove_from_inventory(user_id: int, inv_id: int) -> bool:
    conn = get_db()
    cursor = conn.execute(
        "DELETE FROM inventory WHERE id = ? AND user_id = ?", (inv_id, user_id)
    )
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


def get_inventory(user_id: int) -> list[dict]:
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM inventory WHERE user_id = ? ORDER BY price DESC", (user_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def sell_skin(user_id: int, inv_id: int) -> dict | None:
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM inventory WHERE id = ? AND user_id = ?", (inv_id, user_id)
    ).fetchone()
    if not row:
        conn.close()
        return None

    skin = dict(row)
    conn.execute("DELETE FROM inventory WHERE id = ?", (inv_id,))
    conn.execute("UPDATE users SET balance = balance + ? WHERE id = ?", (skin["price"], user_id))
    conn.execute(
        "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'credit', ?, ?)",
        (user_id, skin["price"], f"Продажа {skin['weapon']} | {skin['name']}"),
    )
    conn.commit()
    new_balance = conn.execute("SELECT balance FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return {"skin": skin, "new_balance": new_balance["balance"]}


def sell_all(user_id: int) -> dict:
    conn = get_db()
    rows = conn.execute("SELECT * FROM inventory WHERE user_id = ?", (user_id,)).fetchall()
    total = sum(r["price"] for r in rows)
    conn.execute("DELETE FROM inventory WHERE user_id = ?", (user_id,))
    conn.execute("UPDATE users SET balance = balance + ? WHERE id = ?", (total, user_id))
    conn.execute(
        "INSERT INTO transactions (user_id, type, amount, description) VALUES (?, 'credit', ?, 'Продажа всех скинов')",
        (user_id, total),
    )
    conn.commit()
    new_balance = conn.execute("SELECT balance FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return {"total": total, "count": len(rows), "new_balance": new_balance["balance"]}


def get_transactions(user_id: int, limit: int = 50) -> list[dict]:
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
        (user_id, limit),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
