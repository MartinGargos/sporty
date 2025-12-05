# Rychlý start backendu

## ⚡ Rychlé spuštění (3 kroky)

### 1. Vytvoř `.env` soubor

V `backend/` složce vytvoř soubor `.env`:

```env
DATABASE_URL=postgresql://postgres:sporty_password@localhost:5432/sporty_db
JWT_SECRET=super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### 2. Spusť databázi

```bash
docker run --name sporty-postgres -e POSTGRES_PASSWORD=sporty_password -e POSTGRES_DB=sporty_db -p 5432:5432 -d postgres:15
```

Pokud už existuje: `docker start sporty-postgres`

### 3. Seed a spusť

```bash
cd backend
npm run seed
npm run start:dev
```

Hotovo! 🚀 Backend běží na `http://localhost:3000`

---

📖 Podrobnější průvodce: `SETUP_PRUVODCE.md`


