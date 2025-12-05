# Sporty Backend - NestJS + PostgreSQL

## Struktura projektu

```
backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   ├── database/
│   │   └── database.module.ts  # Database configuration
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       └── auth-response.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── events/
│   │   ├── events.module.ts
│   │   ├── events.service.ts
│   │   ├── events.controller.ts
│   │   ├── entities/
│   │   │   └── event.entity.ts
│   │   └── dto/
│   │       ├── create-event.dto.ts
│   │       ├── update-event.dto.ts
│   │       └── event-response.dto.ts
│   ├── event-players/
│   │   ├── event-players.module.ts
│   │   ├── event-players.service.ts
│   │   └── entities/
│   │       └── event-player.entity.ts
│   ├── chat/
│   │   ├── chat.module.ts
│   │   ├── chat.service.ts
│   │   ├── chat.controller.ts
│   │   └── entities/
│   │       └── chat-message.entity.ts
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   └── notifications.service.ts
│   └── common/
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       └── decorators/
│           └── current-user.decorator.ts
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Setup

1. Instalace závislostí:
```bash
cd backend
npm install
```

2. Vytvoření `.env` souboru:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sporty_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
```

3. Spuštění databáze (Docker):
```bash
docker run --name sporty-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sporty_db -p 5432:5432 -d postgres:15
```

4. Migrace databáze:
```bash
npm run migration:run
```

5. Spuštění serveru:
```bash
npm run start:dev
```

## API Endpointy

### Autentizace
- `POST /auth/register` - Registrace
- `POST /auth/login` - Přihlášení
- `GET /auth/me` - Aktuální uživatel (protected)

### Zápasy
- `GET /events` - Seznam nadcházejících zápasů
- `GET /events/:id` - Detail zápasu
- `POST /events` - Vytvoření zápasu (protected)
- `PATCH /events/:id` - Editace zápasu (protected, jen organizátor)
- `DELETE /events/:id` - Smazání zápasu (protected, jen organizátor)
- `POST /events/:id/join` - Přihlášení na zápas (protected)
- `POST /events/:id/leave` - Odhlášení ze zápasu (protected)
- `POST /events/:id/no-show` - Označení no-show (protected, jen organizátor)

### Chat
- `GET /events/:id/messages` - Zprávy u zápasu (protected)
- `POST /events/:id/messages` - Odeslání zprávy (protected)

### Statistiky
- `GET /me/stats` - Statistiky aktuálního uživatele (protected)


