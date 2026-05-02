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

const WEAPON_ICONS = {
    'AK-47': '🔫',
    'M4A4': '🔫',
    'M4A1-S': '🔫',
    'AWP': '🎯',
    'Desert Eagle': '🔫',
    'USP-S': '🔫',
    'Glock-18': '🔫',
    'P250': '🔫',
    'Five-SeveN': '🔫',
    'Нож': '🗡️',
    'Перчатки': '🧤',
    'Galil AR': '🔫',
    'FAMAS': '🔫',
    'SSG 08': '🎯',
    'SG 553': '🔫',
    'AUG': '🔫',
    'MAC-10': '🔫',
    'MP9': '🔫',
    'UMP-45': '🔫',
    'P90': '🔫',
    'PP-Bizon': '🔫',
    'MP7': '🔫',
    'Sawed-Off': '🔫',
    'MAG-7': '🔫',
    'Nova': '🔫',
    'XM1014': '🔫',
    'M249': '🔫',
    'Negev': '🔫',
};

const ALL_SKINS = [
    // Consumer grade
    { id: 1, name: 'Песчаная буря', weapon: 'P250', rarity: 'consumer', price: 15 },
    { id: 2, name: 'Городская маска', weapon: 'Glock-18', rarity: 'consumer', price: 12 },
    { id: 3, name: 'Лесной DDPAT', weapon: 'Galil AR', rarity: 'consumer', price: 18 },
    { id: 4, name: 'Граффити', weapon: 'MAC-10', rarity: 'consumer', price: 10 },
    { id: 5, name: 'Песок', weapon: 'Nova', rarity: 'consumer', price: 8 },

    // Industrial grade
    { id: 6, name: 'Водная стихия', weapon: 'MP9', rarity: 'industrial', price: 35 },
    { id: 7, name: 'Цифровой муар', weapon: 'FAMAS', rarity: 'industrial', price: 45 },
    { id: 8, name: 'Ночь', weapon: 'UMP-45', rarity: 'industrial', price: 30 },
    { id: 9, name: 'Хаки', weapon: 'SSG 08', rarity: 'industrial', price: 40 },
    { id: 10, name: 'Контракт', weapon: 'P90', rarity: 'industrial', price: 50 },

    // Mil-Spec
    { id: 11, name: 'Поверхностная закалка', weapon: 'Five-SeveN', rarity: 'milspec', price: 120 },
    { id: 12, name: 'Кровавая паутина', weapon: 'MAG-7', rarity: 'milspec', price: 95 },
    { id: 13, name: 'Азимов', weapon: 'P250', rarity: 'milspec', price: 180 },
    { id: 14, name: 'Ядерная угроза', weapon: 'MP7', rarity: 'milspec', price: 150 },
    { id: 15, name: 'Кибер-сила', weapon: 'AUG', rarity: 'milspec', price: 130 },
    { id: 16, name: 'Полигон', weapon: 'SG 553', rarity: 'milspec', price: 110 },

    // Restricted
    { id: 17, name: 'Азимов', weapon: 'USP-S', rarity: 'restricted', price: 450 },
    { id: 18, name: 'Водная стихия', weapon: 'Glock-18', rarity: 'restricted', price: 380 },
    { id: 19, name: 'Неонуар', weapon: 'USP-S', rarity: 'restricted', price: 520 },
    { id: 20, name: 'Гипер-зверь', weapon: 'M4A4', rarity: 'restricted', price: 680 },
    { id: 21, name: 'Циатек', weapon: 'AK-47', rarity: 'restricted', price: 490 },
    { id: 22, name: 'Кракен', weapon: 'SSG 08', rarity: 'restricted', price: 350 },

    // Classified
    { id: 23, name: 'Вулкан', weapon: 'AK-47', rarity: 'classified', price: 1200 },
    { id: 24, name: 'Азимов', weapon: 'M4A4', rarity: 'classified', price: 1500 },
    { id: 25, name: 'Электрический улей', weapon: 'Desert Eagle', rarity: 'classified', price: 980 },
    { id: 26, name: 'Пустынный гидра', weapon: 'AWP', rarity: 'classified', price: 1800 },
    { id: 27, name: 'Неонуар', weapon: 'M4A1-S', rarity: 'classified', price: 1350 },
    { id: 28, name: 'Лотос', weapon: 'USP-S', rarity: 'classified', price: 2200 },

    // Covert
    { id: 29, name: 'Огненный змей', weapon: 'AK-47', rarity: 'covert', price: 5500 },
    { id: 30, name: 'Медуза', weapon: 'AWP', rarity: 'covert', price: 8200 },
    { id: 31, name: 'Вой', weapon: 'M4A4', rarity: 'covert', price: 6800 },
    { id: 32, name: 'Пламя', weapon: 'Desert Eagle', rarity: 'covert', price: 4200 },
    { id: 33, name: 'Кровавая паутина', weapon: 'M4A1-S', rarity: 'covert', price: 3800 },
    { id: 34, name: 'Дикий лотос', weapon: 'AK-47', rarity: 'covert', price: 12000 },

    // Gold (Knives & Gloves)
    { id: 35, name: 'Градиент', weapon: 'Нож', rarity: 'gold', price: 18000 },
    { id: 36, name: 'Кровавая паутина', weapon: 'Нож', rarity: 'gold', price: 25000 },
    { id: 37, name: 'Мраморный градиент', weapon: 'Нож', rarity: 'gold', price: 32000 },
    { id: 38, name: 'Мятные', weapon: 'Перчатки', rarity: 'gold', price: 15000 },
    { id: 39, name: 'Кровавые', weapon: 'Перчатки', rarity: 'gold', price: 22000 },
    { id: 40, name: 'Убийство', weapon: 'Нож', rarity: 'gold', price: 45000 },
];

const CASES = [
    {
        id: 1,
        name: 'Кейс «Призма»',
        price: 199,
        rarity: 'milspec',
        icon: '📦',
        gradient: 'linear-gradient(135deg, #4b69ff, #6366f1)',
        skins: [1, 2, 3, 6, 7, 11, 12, 17, 18, 23, 24, 29, 30, 35],
        drops: {
            consumer: 35,
            industrial: 25,
            milspec: 20,
            restricted: 12,
            classified: 5,
            covert: 2.5,
            gold: 0.5
        }
    },
    {
        id: 2,
        name: 'Кейс «Спектр»',
        price: 349,
        rarity: 'restricted',
        icon: '🎁',
        gradient: 'linear-gradient(135deg, #8847ff, #d32ce6)',
        skins: [4, 5, 8, 9, 13, 14, 19, 20, 25, 26, 31, 32, 36, 38],
        drops: {
            consumer: 30,
            industrial: 22,
            milspec: 22,
            restricted: 14,
            classified: 7,
            covert: 4,
            gold: 1
        }
    },
    {
        id: 3,
        name: 'Кейс «Феникс»',
        price: 499,
        rarity: 'classified',
        icon: '🔥',
        gradient: 'linear-gradient(135deg, #d32ce6, #eb4b4b)',
        skins: [3, 7, 10, 15, 16, 21, 22, 27, 28, 33, 34, 37, 39, 40],
        drops: {
            consumer: 25,
            industrial: 20,
            milspec: 22,
            restricted: 15,
            classified: 10,
            covert: 6,
            gold: 2
        }
    },
    {
        id: 4,
        name: 'Кейс «Нож»',
        price: 999,
        rarity: 'gold',
        icon: '🗡️',
        gradient: 'linear-gradient(135deg, #ffd700, #f59e0b)',
        skins: [15, 16, 21, 22, 27, 28, 33, 34, 35, 36, 37, 38, 39, 40],
        drops: {
            consumer: 0,
            industrial: 0,
            milspec: 15,
            restricted: 25,
            classified: 25,
            covert: 20,
            gold: 15
        }
    },
    {
        id: 5,
        name: 'Кейс «Новичок»',
        price: 49,
        rarity: 'milspec',
        icon: '🎮',
        gradient: 'linear-gradient(135deg, #10b981, #6366f1)',
        skins: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        drops: {
            consumer: 40,
            industrial: 30,
            milspec: 20,
            restricted: 7,
            classified: 2.5,
            covert: 0.4,
            gold: 0.1
        }
    },
    {
        id: 6,
        name: 'Кейс «Легенда»',
        price: 1499,
        rarity: 'covert',
        icon: '👑',
        gradient: 'linear-gradient(135deg, #eb4b4b, #ffd700)',
        skins: [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        drops: {
            consumer: 0,
            industrial: 0,
            milspec: 0,
            restricted: 15,
            classified: 30,
            covert: 35,
            gold: 20
        }
    }
];

function getSkinById(id) {
    return ALL_SKINS.find(s => s.id === id);
}

function getSkinIcon(skin) {
    return WEAPON_ICONS[skin.weapon] || '🔫';
}

function getRarityName(rarity) {
    return RARITY_NAMES[rarity] || rarity;
}

function getRarityColor(rarity) {
    return RARITY_COLORS[rarity] || '#ffffff';
}
