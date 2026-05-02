/* ===== CS2 Skins Data ===== */

const RARITY_ORDER = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert', 'gold'];

const RARITY_NAMES = {
    consumer: 'Ширпотреб',
    industrial: 'Промышленное',
    milspec: 'Армейское',
    restricted: 'Запрещённое',
    classified: 'Засекреченное',
    covert: 'Тайное',
    gold: 'Легендарное'
};

const RARITY_COLORS = {
    consumer: '#b0c3d9',
    industrial: '#5e98d9',
    milspec: '#4b69ff',
    restricted: '#8847ff',
    classified: '#d32ce6',
    covert: '#eb4b4b',
    gold: '#ffd700'
};

const STEAM_CDN_IMAGE = 'https://api.steamapis.com/image/item/730';

/* Fallback data — used if API is unavailable */
const ALL_SKINS = [
    { id: 1, market_hash_name: 'P250 | Sand Dune (Field-Tested)', name: 'Песчаная буря', weapon: 'P250', rarity: 'consumer', price: 15 },
    { id: 2, market_hash_name: 'Glock-18 | Ground Water (Field-Tested)', name: 'Грунтовые воды', weapon: 'Glock-18', rarity: 'consumer', price: 12 },
    { id: 3, market_hash_name: 'MAC-10 | Silver (Field-Tested)', name: 'Серебро', weapon: 'MAC-10', rarity: 'consumer', price: 10 },
    { id: 4, market_hash_name: 'Nova | Walnut (Field-Tested)', name: 'Орех', weapon: 'Nova', rarity: 'consumer', price: 8 },
    { id: 5, market_hash_name: 'PP-Bizon | Sand Dashed (Field-Tested)', name: 'Песочный штрих', weapon: 'PP-Bizon', rarity: 'consumer', price: 9 },

    { id: 6, market_hash_name: 'MP9 | Storm (Field-Tested)', name: 'Шторм', weapon: 'MP9', rarity: 'industrial', price: 35 },
    { id: 7, market_hash_name: 'FAMAS | Teardown (Field-Tested)', name: 'Разбор', weapon: 'FAMAS', rarity: 'industrial', price: 45 },
    { id: 8, market_hash_name: 'UMP-45 | Mudder (Field-Tested)', name: 'Грязнуля', weapon: 'UMP-45', rarity: 'industrial', price: 30 },
    { id: 9, market_hash_name: 'SG 553 | Tornado (Field-Tested)', name: 'Торнадо', weapon: 'SG 553', rarity: 'industrial', price: 40 },
    { id: 10, market_hash_name: 'P90 | Storm (Field-Tested)', name: 'Шторм', weapon: 'P90', rarity: 'industrial', price: 50 },

    { id: 11, market_hash_name: 'Five-SeveN | Case Hardened (Field-Tested)', name: 'Поверхностная закалка', weapon: 'Five-SeveN', rarity: 'milspec', price: 120 },
    { id: 12, market_hash_name: 'AUG | Stymphalian (Field-Tested)', name: 'Стимфалийская птица', weapon: 'AUG', rarity: 'milspec', price: 95 },
    { id: 13, market_hash_name: 'P250 | Asiimov (Field-Tested)', name: 'Азимов', weapon: 'P250', rarity: 'milspec', price: 180 },
    { id: 14, market_hash_name: 'Galil AR | Chatterbox (Well-Worn)', name: 'Трещотка', weapon: 'Galil AR', rarity: 'milspec', price: 150 },
    { id: 15, market_hash_name: 'MAG-7 | Heat (Factory New)', name: 'Жар', weapon: 'MAG-7', rarity: 'milspec', price: 130 },
    { id: 16, market_hash_name: 'MP7 | Nemesis (Factory New)', name: 'Немезида', weapon: 'MP7', rarity: 'milspec', price: 110 },

    { id: 17, market_hash_name: 'USP-S | Kill Confirmed (Field-Tested)', name: 'Убийство подтверждено', weapon: 'USP-S', rarity: 'restricted', price: 450 },
    { id: 18, market_hash_name: 'Glock-18 | Water Elemental (Field-Tested)', name: 'Водная стихия', weapon: 'Glock-18', rarity: 'restricted', price: 380 },
    { id: 19, market_hash_name: 'USP-S | Neo-Noir (Field-Tested)', name: 'Неонуар', weapon: 'USP-S', rarity: 'restricted', price: 520 },
    { id: 20, market_hash_name: 'M4A4 | Desolate Space (Field-Tested)', name: 'Безлюдный космос', weapon: 'M4A4', rarity: 'restricted', price: 680 },
    { id: 21, market_hash_name: 'AK-47 | Redline (Field-Tested)', name: 'Красная линия', weapon: 'AK-47', rarity: 'restricted', price: 490 },
    { id: 22, market_hash_name: 'SSG 08 | Dragonfire (Factory New)', name: 'Огонь дракона', weapon: 'SSG 08', rarity: 'restricted', price: 350 },

    { id: 23, market_hash_name: 'AK-47 | Vulcan (Field-Tested)', name: 'Вулкан', weapon: 'AK-47', rarity: 'classified', price: 1200 },
    { id: 24, market_hash_name: 'M4A4 | Asiimov (Field-Tested)', name: 'Азимов', weapon: 'M4A4', rarity: 'classified', price: 1500 },
    { id: 25, market_hash_name: 'Desert Eagle | Mecha Industries (Factory New)', name: 'Меха-индустрия', weapon: 'Desert Eagle', rarity: 'classified', price: 980 },
    { id: 26, market_hash_name: 'AWP | Hyper Beast (Field-Tested)', name: 'Гипер-зверь', weapon: 'AWP', rarity: 'classified', price: 1800 },
    { id: 27, market_hash_name: "M4A1-S | Chantico's Fire (Field-Tested)", name: 'Огонь Чантико', weapon: 'M4A1-S', rarity: 'classified', price: 1350 },
    { id: 28, market_hash_name: 'USP-S | Printstream (Factory New)', name: 'Поток печати', weapon: 'USP-S', rarity: 'classified', price: 2200 },

    { id: 29, market_hash_name: 'AK-47 | Fire Serpent (Field-Tested)', name: 'Огненный змей', weapon: 'AK-47', rarity: 'covert', price: 5500 },
    { id: 30, market_hash_name: 'AWP | Medusa (Field-Tested)', name: 'Медуза', weapon: 'AWP', rarity: 'covert', price: 8200 },
    { id: 31, market_hash_name: 'M4A4 | Howl (Field-Tested)', name: 'Вой', weapon: 'M4A4', rarity: 'covert', price: 6800 },
    { id: 32, market_hash_name: 'Desert Eagle | Blaze (Factory New)', name: 'Пламя', weapon: 'Desert Eagle', rarity: 'covert', price: 4200 },
    { id: 33, market_hash_name: 'AK-47 | Wild Lotus (Field-Tested)', name: 'Дикий лотос', weapon: 'AK-47', rarity: 'covert', price: 12000 },
    { id: 34, market_hash_name: 'M4A1-S | Knight (Factory New)', name: 'Рыцарь', weapon: 'M4A1-S', rarity: 'covert', price: 3800 },

    { id: 35, market_hash_name: '★ Karambit | Fade (Factory New)', name: 'Градиент', weapon: 'Karambit', rarity: 'gold', price: 18000 },
    { id: 36, market_hash_name: '★ Butterfly Knife | Crimson Web (Field-Tested)', name: 'Кровавая паутина', weapon: 'Butterfly Knife', rarity: 'gold', price: 25000 },
    { id: 37, market_hash_name: '★ M9 Bayonet | Marble Fade (Factory New)', name: 'Мраморный градиент', weapon: 'M9 Bayonet', rarity: 'gold', price: 32000 },
    { id: 38, market_hash_name: '★ Sport Gloves | Hedge Maze (Field-Tested)', name: 'Лабиринт', weapon: 'Sport Gloves', rarity: 'gold', price: 15000 },
    { id: 39, market_hash_name: '★ Specialist Gloves | Crimson Kimono (Field-Tested)', name: 'Багровое кимоно', weapon: 'Specialist Gloves', rarity: 'gold', price: 22000 },
    { id: 40, market_hash_name: '★ Karambit | Doppler (Factory New)', name: 'Допплер', weapon: 'Karambit', rarity: 'gold', price: 45000 },
];

const CASES = [
    {
        id: 1, name: 'Кейс «Призма»', price: 199, rarity: 'milspec', icon: '📦',
        gradient: 'linear-gradient(135deg, #4b69ff, #6366f1)',
        skins: [1, 2, 3, 6, 7, 11, 12, 17, 18, 23, 24, 29, 30, 35],
        drops: { consumer: 35, industrial: 25, milspec: 20, restricted: 12, classified: 5, covert: 2.5, gold: 0.5 }
    },
    {
        id: 2, name: 'Кейс «Спектр»', price: 349, rarity: 'restricted', icon: '🎁',
        gradient: 'linear-gradient(135deg, #8847ff, #d32ce6)',
        skins: [4, 5, 8, 9, 13, 14, 19, 20, 25, 26, 31, 32, 36, 38],
        drops: { consumer: 30, industrial: 22, milspec: 22, restricted: 14, classified: 7, covert: 4, gold: 1 }
    },
    {
        id: 3, name: 'Кейс «Феникс»', price: 499, rarity: 'classified', icon: '🔥',
        gradient: 'linear-gradient(135deg, #d32ce6, #eb4b4b)',
        skins: [3, 7, 10, 15, 16, 21, 22, 27, 28, 33, 34, 37, 39, 40],
        drops: { consumer: 25, industrial: 20, milspec: 22, restricted: 15, classified: 10, covert: 6, gold: 2 }
    },
    {
        id: 4, name: 'Кейс «Нож»', price: 999, rarity: 'gold', icon: '🗡️',
        gradient: 'linear-gradient(135deg, #ffd700, #f59e0b)',
        skins: [15, 16, 21, 22, 27, 28, 33, 34, 35, 36, 37, 38, 39, 40],
        drops: { consumer: 0, industrial: 0, milspec: 15, restricted: 25, classified: 25, covert: 20, gold: 15 }
    },
    {
        id: 5, name: 'Кейс «Новичок»', price: 49, rarity: 'milspec', icon: '🎮',
        gradient: 'linear-gradient(135deg, #10b981, #6366f1)',
        skins: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        drops: { consumer: 40, industrial: 30, milspec: 20, restricted: 7, classified: 2.5, covert: 0.4, gold: 0.1 }
    },
    {
        id: 6, name: 'Кейс «Легенда»', price: 1499, rarity: 'covert', icon: '👑',
        gradient: 'linear-gradient(135deg, #eb4b4b, #ffd700)',
        skins: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        drops: { consumer: 0, industrial: 0, milspec: 0, restricted: 15, classified: 30, covert: 35, gold: 20 }
    }
];

/* ===== API Integration ===== */

const API_BASE = window.location.origin;
let _apiAvailable = false;
let _realPrices = {};

async function loadSkinsFromAPI() {
    try {
        const resp = await fetch(`${API_BASE}/api/skins`);
        if (!resp.ok) return false;
        const data = await resp.json();
        if (data.success && data.skins) {
            data.skins.forEach(apiSkin => {
                const local = ALL_SKINS.find(s => s.id === apiSkin.id);
                if (local) {
                    local.image = apiSkin.image;
                    if (apiSkin.real_price) local.price = apiSkin.real_price;
                    if (apiSkin.avg_price) local.avg_price = apiSkin.avg_price;
                    local.market_hash_name = apiSkin.market_hash_name;
                }
            });
            _apiAvailable = true;
            return true;
        }
    } catch (e) {
        console.log('API not available, using fallback data');
    }
    return false;
}

async function checkWithdrawAvailable() {
    try {
        const resp = await fetch(`${API_BASE}/api/status`);
        if (!resp.ok) return false;
        const data = await resp.json();
        return data.api_key_configured || false;
    } catch {
        return false;
    }
}

async function requestWithdraw(skin, tradeToken, partner) {
    const resp = await fetch(`${API_BASE}/api/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            market_hash_name: skin.market_hash_name,
            max_price: Math.round(skin.price * 100),
            trade_token: tradeToken,
            partner: partner,
        }),
    });
    return resp.json();
}

/* ===== Helper Functions ===== */

function getSkinById(id) {
    return ALL_SKINS.find(s => s.id === id);
}

function getSkinImage(skin) {
    if (skin.image) return skin.image;
    if (skin.market_hash_name) return `${STEAM_CDN_IMAGE}/${encodeURIComponent(skin.market_hash_name)}`;
    return null;
}

function getSkinImageTag(skin, className = '') {
    const url = getSkinImage(skin);
    if (url) {
        return `<img src="${url}" alt="${skin.name}" class="skin-img ${className}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <span class="skin-icon-fallback ${className}" style="display:none">${getSkinIcon(skin)}</span>`;
    }
    return `<span class="skin-icon-fallback ${className}">${getSkinIcon(skin)}</span>`;
}

function getSkinIcon(skin) {
    const icons = {
        'P250': '🔫', 'Glock-18': '🔫', 'MAC-10': '🔫', 'Nova': '🔫',
        'PP-Bizon': '🔫', 'MP9': '🔫', 'FAMAS': '🔫', 'UMP-45': '🔫',
        'SG 553': '🔫', 'P90': '🔫', 'Five-SeveN': '🔫', 'AUG': '🔫',
        'Galil AR': '🔫', 'MAG-7': '🔫', 'MP7': '🔫', 'USP-S': '🔫',
        'M4A4': '🔫', 'AK-47': '🔫', 'SSG 08': '🎯', 'AWP': '🎯',
        'Desert Eagle': '🔫', 'M4A1-S': '🔫', 'Karambit': '🗡️',
        'Butterfly Knife': '🗡️', 'M9 Bayonet': '🗡️',
        'Sport Gloves': '🧤', 'Specialist Gloves': '🧤',
    };
    return icons[skin.weapon] || '🔫';
}

function getRarityName(rarity) {
    return RARITY_NAMES[rarity] || rarity;
}

function getRarityColor(rarity) {
    return RARITY_COLORS[rarity] || '#ffffff';
}
