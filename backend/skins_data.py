"""
Curated list of real CS2 skins used in cases and upgrades.
market_hash_name must exactly match Steam/market.csgo.com naming.
"""

RARITY_ORDER = ["consumer", "industrial", "milspec", "restricted", "classified", "covert", "gold"]

RARITY_NAMES_RU = {
    "consumer": "Ширпотреб",
    "industrial": "Промышленное",
    "milspec": "Армейское",
    "restricted": "Запрещённое",
    "classified": "Засекреченное",
    "covert": "Тайное",
    "gold": "Легендарное",
}

# Real CS2 skins with exact market_hash_names
ALL_SKINS = [
    # === Consumer Grade ===
    {"id": 1, "market_hash_name": "P250 | Sand Dune (Field-Tested)", "name": "Песчаная буря", "weapon": "P250", "rarity": "consumer"},
    {"id": 2, "market_hash_name": "Glock-18 | Ground Water (Field-Tested)", "name": "Грунтовые воды", "weapon": "Glock-18", "rarity": "consumer"},
    {"id": 3, "market_hash_name": "MAC-10 | Silver (Field-Tested)", "name": "Серебро", "weapon": "MAC-10", "rarity": "consumer"},
    {"id": 4, "market_hash_name": "Nova | Walnut (Field-Tested)", "name": "Орех", "weapon": "Nova", "rarity": "consumer"},
    {"id": 5, "market_hash_name": "PP-Bizon | Sand Dashed (Field-Tested)", "name": "Песочный штрих", "weapon": "PP-Bizon", "rarity": "consumer"},

    # === Industrial Grade ===
    {"id": 6, "market_hash_name": "MP9 | Storm (Field-Tested)", "name": "Шторм", "weapon": "MP9", "rarity": "industrial"},
    {"id": 7, "market_hash_name": "FAMAS | Teardown (Field-Tested)", "name": "Разбор", "weapon": "FAMAS", "rarity": "industrial"},
    {"id": 8, "market_hash_name": "UMP-45 | Mudder (Field-Tested)", "name": "Грязнуля", "weapon": "UMP-45", "rarity": "industrial"},
    {"id": 9, "market_hash_name": "SG 553 | Tornado (Field-Tested)", "name": "Торнадо", "weapon": "SG 553", "rarity": "industrial"},
    {"id": 10, "market_hash_name": "P90 | Storm (Field-Tested)", "name": "Шторм", "weapon": "P90", "rarity": "industrial"},

    # === Mil-Spec ===
    {"id": 11, "market_hash_name": "Five-SeveN | Case Hardened (Field-Tested)", "name": "Поверхностная закалка", "weapon": "Five-SeveN", "rarity": "milspec"},
    {"id": 12, "market_hash_name": "AUG | Stymphalian (Field-Tested)", "name": "Стимфалийская птица", "weapon": "AUG", "rarity": "milspec"},
    {"id": 13, "market_hash_name": "P250 | Asiimov (Field-Tested)", "name": "Азимов", "weapon": "P250", "rarity": "milspec"},
    {"id": 14, "market_hash_name": "Galil AR | Chatterbox (Well-Worn)", "name": "Трещотка", "weapon": "Galil AR", "rarity": "milspec"},
    {"id": 15, "market_hash_name": "MAG-7 | Heat (Factory New)", "name": "Жар", "weapon": "MAG-7", "rarity": "milspec"},
    {"id": 16, "market_hash_name": "MP7 | Nemesis (Factory New)", "name": "Немезида", "weapon": "MP7", "rarity": "milspec"},

    # === Restricted ===
    {"id": 17, "market_hash_name": "USP-S | Kill Confirmed (Field-Tested)", "name": "Убийство подтверждено", "weapon": "USP-S", "rarity": "restricted"},
    {"id": 18, "market_hash_name": "Glock-18 | Water Elemental (Field-Tested)", "name": "Водная стихия", "weapon": "Glock-18", "rarity": "restricted"},
    {"id": 19, "market_hash_name": "USP-S | Neo-Noir (Field-Tested)", "name": "Неонуар", "weapon": "USP-S", "rarity": "restricted"},
    {"id": 20, "market_hash_name": "M4A4 | Desolate Space (Field-Tested)", "name": "Безлюдный космос", "weapon": "M4A4", "rarity": "restricted"},
    {"id": 21, "market_hash_name": "AK-47 | Redline (Field-Tested)", "name": "Красная линия", "weapon": "AK-47", "rarity": "restricted"},
    {"id": 22, "market_hash_name": "SSG 08 | Dragonfire (Factory New)", "name": "Огонь дракона", "weapon": "SSG 08", "rarity": "restricted"},

    # === Classified ===
    {"id": 23, "market_hash_name": "AK-47 | Vulcan (Field-Tested)", "name": "Вулкан", "weapon": "AK-47", "rarity": "classified"},
    {"id": 24, "market_hash_name": "M4A4 | Asiimov (Field-Tested)", "name": "Азимов", "weapon": "M4A4", "rarity": "classified"},
    {"id": 25, "market_hash_name": "Desert Eagle | Mecha Industries (Factory New)", "name": "Меха-индустрия", "weapon": "Desert Eagle", "rarity": "classified"},
    {"id": 26, "market_hash_name": "AWP | Hyper Beast (Field-Tested)", "name": "Гипер-зверь", "weapon": "AWP", "rarity": "classified"},
    {"id": 27, "market_hash_name": "M4A1-S | Chantico's Fire (Field-Tested)", "name": "Огонь Чантико", "weapon": "M4A1-S", "rarity": "classified"},
    {"id": 28, "market_hash_name": "USP-S | Printstream (Factory New)", "name": "Поток печати", "weapon": "USP-S", "rarity": "classified"},

    # === Covert ===
    {"id": 29, "market_hash_name": "AK-47 | Fire Serpent (Field-Tested)", "name": "Огненный змей", "weapon": "AK-47", "rarity": "covert"},
    {"id": 30, "market_hash_name": "AWP | Medusa (Field-Tested)", "name": "Медуза", "weapon": "AWP", "rarity": "covert"},
    {"id": 31, "market_hash_name": "M4A4 | Howl (Field-Tested)", "name": "Вой", "weapon": "M4A4", "rarity": "covert"},
    {"id": 32, "market_hash_name": "Desert Eagle | Blaze (Factory New)", "name": "Пламя", "weapon": "Desert Eagle", "rarity": "covert"},
    {"id": 33, "market_hash_name": "AK-47 | Wild Lotus (Field-Tested)", "name": "Дикий лотос", "weapon": "AK-47", "rarity": "covert"},
    {"id": 34, "market_hash_name": "M4A1-S | Knight (Factory New)", "name": "Рыцарь", "weapon": "M4A1-S", "rarity": "covert"},

    # === Gold (Knives & Gloves) ===
    {"id": 35, "market_hash_name": "★ Karambit | Fade (Factory New)", "name": "Градиент", "weapon": "Karambit", "rarity": "gold"},
    {"id": 36, "market_hash_name": "★ Butterfly Knife | Crimson Web (Field-Tested)", "name": "Кровавая паутина", "weapon": "Butterfly Knife", "rarity": "gold"},
    {"id": 37, "market_hash_name": "★ M9 Bayonet | Marble Fade (Factory New)", "name": "Мраморный градиент", "weapon": "M9 Bayonet", "rarity": "gold"},
    {"id": 38, "market_hash_name": "★ Sport Gloves | Hedge Maze (Field-Tested)", "name": "Лабиринт", "weapon": "Sport Gloves", "rarity": "gold"},
    {"id": 39, "market_hash_name": "★ Specialist Gloves | Crimson Kimono (Field-Tested)", "name": "Багровое кимоно", "weapon": "Specialist Gloves", "rarity": "gold"},
    {"id": 40, "market_hash_name": "★ Karambit | Doppler (Factory New)", "name": "Допплер", "weapon": "Karambit", "rarity": "gold"},
]

# Cases configuration
CASES = [
    {
        "id": 1,
        "name": "Кейс «Призма»",
        "price": 199,
        "rarity": "milspec",
        "icon": "📦",
        "gradient": "linear-gradient(135deg, #4b69ff, #6366f1)",
        "skins": [1, 2, 3, 6, 7, 11, 12, 17, 18, 23, 24, 29, 30, 35],
        "drops": {"consumer": 35, "industrial": 25, "milspec": 20, "restricted": 12, "classified": 5, "covert": 2.5, "gold": 0.5},
    },
    {
        "id": 2,
        "name": "Кейс «Спектр»",
        "price": 349,
        "rarity": "restricted",
        "icon": "🎁",
        "gradient": "linear-gradient(135deg, #8847ff, #d32ce6)",
        "skins": [4, 5, 8, 9, 13, 14, 19, 20, 25, 26, 31, 32, 36, 38],
        "drops": {"consumer": 30, "industrial": 22, "milspec": 22, "restricted": 14, "classified": 7, "covert": 4, "gold": 1},
    },
    {
        "id": 3,
        "name": "Кейс «Феникс»",
        "price": 499,
        "rarity": "classified",
        "icon": "🔥",
        "gradient": "linear-gradient(135deg, #d32ce6, #eb4b4b)",
        "skins": [3, 7, 10, 15, 16, 21, 22, 27, 28, 33, 34, 37, 39, 40],
        "drops": {"consumer": 25, "industrial": 20, "milspec": 22, "restricted": 15, "classified": 10, "covert": 6, "gold": 2},
    },
    {
        "id": 4,
        "name": "Кейс «Нож»",
        "price": 999,
        "rarity": "gold",
        "icon": "🗡️",
        "gradient": "linear-gradient(135deg, #ffd700, #f59e0b)",
        "skins": [15, 16, 21, 22, 27, 28, 33, 34, 35, 36, 37, 38, 39, 40],
        "drops": {"consumer": 0, "industrial": 0, "milspec": 15, "restricted": 25, "classified": 25, "covert": 20, "gold": 15},
    },
    {
        "id": 5,
        "name": "Кейс «Новичок»",
        "price": 49,
        "rarity": "milspec",
        "icon": "🎮",
        "gradient": "linear-gradient(135deg, #10b981, #6366f1)",
        "skins": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        "drops": {"consumer": 40, "industrial": 30, "milspec": 20, "restricted": 7, "classified": 2.5, "covert": 0.4, "gold": 0.1},
    },
    {
        "id": 6,
        "name": "Кейс «Легенда»",
        "price": 1499,
        "rarity": "covert",
        "icon": "👑",
        "gradient": "linear-gradient(135deg, #eb4b4b, #ffd700)",
        "skins": [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        "drops": {"consumer": 0, "industrial": 0, "milspec": 0, "restricted": 15, "classified": 30, "covert": 35, "gold": 20},
    },
]
