# Průvodce setupem backendu - Krok za krokem

## Krok 1: Vytvoř .env soubor

V adresáři `backend` vytvoř soubor `.env` (bez přípony) s tímto obsahem:

```env
DATABASE_URL=postgresql://postgres:sporty_password@localhost:5432/sporty_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

**⚠️ Důležité:** Pokud máš jiné heslo v PostgreSQL, změň `sporty_password` v `DATABASE_URL`.

## Krok 2: Spusť PostgreSQL databázi

### Možnost A: Docker (doporučeno)

```bash
docker run --name sporty-postgres \
  -e POSTGRES_PASSWORD=sporty_password \
  -e POSTGRES_DB=sporty_db \
  -p 5432:5432 \
  -d postgres:15
```

Pokud už kontejner existuje:
```bash
docker start sporty-postgres
```

### Možnost B: Lokální PostgreSQL

Pokud máš PostgreSQL nainstalovaný lokálně, vytvoř databázi:
```sql
CREATE DATABASE sporty_db;
```

A uprav `DATABASE_URL` v `.env` souboru.

## Krok 3: Ověř, že databáze běží

```bash
# Test připojení k PostgreSQL (pokud máš psql)
psql -h localhost -U postgres -d sporty_db
```

Nebo jen ověř, že Docker kontejner běží:
```bash
docker ps
```

Měl bys vidět kontejner `sporty-postgres`.

## Krok 4: Spusť seed skript

```bash
cd backend
npm run seed
```

Mělo by to vytvořit sporty a sportoviště. Výstup by měl vypadat takto:

```
Initializace databázového připojení...
✓ Databáze připojena

Vytváření sportů...
✓ Sport vytvořen: Badminton
✓ Sport vytvořen: Padel
✓ Sport vytvořen: Squash

Vytváření sportovišť...
✓ Sportoviště vytvořeno: Vítkovice Aréna
✓ Sportoviště vytvořeno: Padel Club Poruba
...
✓ Seeding dokončeno
```

## Krok 5: Spusť backend server

```bash
npm run start:dev
```

Mělo by to zobrazit:
```
🚀 Sporty backend běží na portu 3000
```

## Řešení problémů

### Chyba: "Cannot connect to database"

1. Ověř, že PostgreSQL běží (`docker ps` nebo služba PostgreSQL)
2. Zkontroluj `DATABASE_URL` v `.env` souboru
3. Zkontroluj, že port 5432 není obsazený jinou aplikací

### Chyba: "Module not found" nebo podobné

Spusť znovu:
```bash
npm install
```

### Chyba při seedingu

1. Zkontroluj, že databáze existuje
2. Zkontroluj, že máš správná oprávnění v PostgreSQL
3. Zkontroluj `.env` soubor - `DATABASE_URL` musí být správně nastavený

## Testování

Po spuštění můžeš otestovat API:

```bash
# Registrace uživatele
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\",\"location\":\"Ostrava, Česko\"}"
```

## Hotovo! 🎉

Backend by měl být nyní připravený. Můžeš pokračovat s napojením frontendu.


