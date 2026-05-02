# CS2 SKINS — Кейсы и Апгрейды

Веб-сайт для открытия кейсов и апгрейда скинов CS2 с интеграцией market.csgo.com.

## Функционал

- **Кейсы** — 6 кейсов с рулеткой и анимацией. Реальные изображения скинов из Steam CDN.
- **Апгрейд** — улучшение скинов с системой шансов.
- **Инвентарь** — хранение, продажа и вывод скинов.
- **Реальные цены** — цены подтягиваются с market.csgo.com API.
- **Вывод скинов** — автоматическая покупка и передача скинов через market.csgo.com (требуется API ключ).
- **Сохранение** — состояние в localStorage.

## Архитектура

```
├── index.html          # Фронтенд
├── css/                # Стили
├── js/                 # Клиентская логика
│   ├── data.js         # Данные скинов + API интеграция
│   ├── app.js          # Основная логика
│   ├── cases.js        # Открытие кейсов
│   ├── upgrade.js      # Апгрейд
│   └── particles.js    # Фоновые частицы
├── backend/            # FastAPI бэкенд
│   ├── main.py         # API сервер
│   ├── market_api.py   # Клиент market.csgo.com
│   ├── skins_data.py   # Данные скинов
│   └── config.py       # Конфигурация
└── pyproject.toml
```

## Запуск

### Только фронтенд (без API)
```bash
# Откройте index.html в браузере
# Картинки скинов будут загружаться из Steam CDN
```

### С бэкендом (реальные цены + вывод)
```bash
# 1. Установите зависимости
pip install -r backend/requirements.txt

# 2. (Опционально) Настройте API ключ
cp .env.example .env
# Отредактируйте .env и добавьте ваш MARKET_CSGO_API_KEY

# 3. Запустите сервер
cd backend && uvicorn main:app --reload --port 8000

# 4. Откройте http://localhost:8000
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/skins` | Все скины с картинками и ценами |
| GET | `/api/cases` | Все кейсы с содержимым |
| GET | `/api/prices` | Цены с market.csgo.com |
| GET | `/api/status` | Статус API (ключ, баланс) |
| POST | `/api/withdraw` | Вывод скина (покупка + трансфер) |
| GET | `/api/withdraw/status/{id}` | Статус вывода |
| GET | `/api/search/{name}` | Поиск предмета на маркете |

## market.csgo.com API

Для работы с ценами API ключ не нужен. Для вывода скинов:

1. Зайдите на https://market.csgo.com
2. Авторизуйтесь через Steam
3. Создайте API ключ: https://market.csgo.com/en/api/content/start
4. Добавьте ключ в `.env` файл
