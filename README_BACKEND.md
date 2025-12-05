# Sporty Backend - Kompletní MVP implementace

## 📋 Přehled

Kompletní backend implementace pro mobilní aplikaci Sporty postavená na **NestJS + PostgreSQL + TypeORM**. 

## ✅ Implementované funkce

### 1. Autentizace
- ✅ Registrace uživatele (`POST /auth/register`)
- ✅ Přihlášení s JWT (`POST /auth/login`)
- ✅ Získání aktuálního uživatele (`GET /auth/me`)

### 2. Správa zápasů
- ✅ Seznam nadcházejících zápasů (`GET /events`)
- ✅ Moje zápasy (`GET /events/my`)
- ✅ Detail zápasu (`GET /events/:id`)
- ✅ Vytvoření zápasu (`POST /events`)
- ✅ Editace zápasu (`PATCH /events/:id`) - jen organizátor
- ✅ Smazání zápasu (`DELETE /events/:id`) - jen organizátor

### 3. Přihlašování na zápasy
- ✅ Přihlášení na zápas (`POST /events/:id/join`)
  - Automatické přiřazení statusu `confirmed` nebo `waiting`
  - FIFO čekací listina
- ✅ Odhlášení ze zápasu (`POST /events/:id/leave`)
  - Automatický přesun prvního z čekací listiny

### 4. No-show systém
- ✅ Označení no-show (`POST /events/:id/no-show`)
  - Jen organizátor
  - Validace, že zápas už skončil
  - Navýšení no_shows u hráče

### 5. Chat
- ✅ Získání zpráv (`GET /events/:id/messages`)
- ✅ Odeslání zprávy (`POST /events/:id/messages`)

### 6. Statistiky
- ✅ Statistiky hráče (`GET /me/stats`)
  - Počet odehraných zápasů
  - Počet odehraných hodin
  - Počet no-shows

### 7. Notifikace (struktura připravena)
- ✅ Uložení push tokenu (`POST /me/push-token`)
- ⚠️ TODO: Expo Push Notification API integrace

## 🚀 Rychlý start

### 1. Instalace

```bash
cd backend
npm install
```

### 2. Databáze

```bash
# Spuštění PostgreSQL v Dockeru
docker run --name sporty-postgres \
  -e POSTGRES_PASSWORD=sporty_password \
  -e POSTGRES_DB=sporty_db \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Konfigurace

Vytvoř `.env` soubor:

```env
DATABASE_URL=postgresql://postgres:sporty_password@localhost:5432/sporty_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### 4. Seed dat

```bash
npm run seed
```

Tím se vytvoří základní sporty a sportoviště.

### 5. Spuštění

```bash
npm run start:dev
```

Backend poběží na `http://localhost:3000`

## 📚 Struktura projektu

```
backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── database/                  # DB konfigurace
│   ├── auth/                      # Autentizace
│   ├── users/                     # Správa uživatelů
│   ├── events/                    # Zápasy
│   ├── event-players/             # Přihlašování na zápasy
│   ├── chat/                      # Chat
│   ├── notifications/             # Notifikace
│   ├── sports/                    # Sporty
│   ├── venues/                    # Sportoviště
│   └── common/                    # Společné utilities
├── scripts/
│   └── seed.ts                    # Seed skript
└── DATABASE_SCHEMA.md             # Databázový model
```

## 🔌 API Dokumentace

### Autentizace

#### Registrace
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "Jan Novák",
  "location": "Ostrava, Česko"
}
```

#### Přihlášení
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Odpověď obsahuje `accessToken` - použij v `Authorization: Bearer <token>` headeru.

### Zápasy

#### Seznam zápasů
```http
GET /events
Authorization: Bearer <token>  # Volitelné
```

#### Moje zápasy
```http
GET /events/my
Authorization: Bearer <token>
```

#### Vytvoření zápasu
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "sportId": "badminton",
  "date": "2025-01-20",
  "timeStart": "18:00",
  "timeEnd": "19:00",
  "placeName": "OSTRAVA – Vítkovice Aréna",
  "reservationType": "reserved",
  "playerCountTotal": 4,
  "skillMin": 1,
  "skillMax": 2,
  "description": "Pohodový badminton"
}
```

#### Přihlášení na zápas
```http
POST /events/:id/join
Authorization: Bearer <token>
```

#### Chat zprávy
```http
GET /events/:id/messages
Authorization: Bearer <token>

POST /events/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Ahoj, přijdu včas!"
}
```

## 📝 Poznámky

- **Development mód**: TypeORM automaticky vytvoří tabulky (`synchronize: true`)
- **Produkce**: Použij migrace místo synchronize
- **CORS**: V developmentu povoleno pro všechny originy - v produkci změň!
- **JWT**: Token expiruje za 7 dní (lze změnit v `.env`)

## 🔜 Další kroky

1. ✅ Backend struktura
2. ✅ API endpointy
3. ⏳ Napojení frontendu
4. ⏳ Expo Push Notifications
5. ⏳ Produkční deployment
6. ⏳ Migrace místo synchronize

## 📖 Dokumentace

- `DATABASE_SCHEMA.md` - Databázový model
- `IMPLEMENTATION_GUIDE.md` - Detailní průvodce
- `SUMMARY.md` - Shrnutí implementace
- `FRONTEND_INTEGRATION.md` - Jak napojit frontend


