# Průvodce implementací backendu

## 1. Setup databáze

### Instalace PostgreSQL (Docker)

```bash
docker run --name sporty-postgres \
  -e POSTGRES_PASSWORD=sporty_password \
  -e POSTGRES_DB=sporty_db \
  -p 5432:5432 \
  -d postgres:15
```

### Vytvoření .env souboru

Zkopíruj `.env.example` na `.env` a uprav hodnoty:

```bash
cp .env.example .env
```

### Spuštění seed dat

Po vytvoření databáze spusť seed pro základní data (sporty, sportoviště):

```bash
npm run seed
```

## 2. Spuštění backendu

```bash
cd backend
npm install
npm run start:dev
```

Backend poběží na `http://localhost:3000`

## 3. Testování API

### Registrace uživatele

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "location": "Ostrava, Česko"
  }'
```

### Přihlášení

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Odpověď obsahuje `accessToken` - použij ho v dalších requestech.

### Vytvoření zápasu

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sportId": "badminton",
    "date": "2025-01-20",
    "timeStart": "18:00",
    "timeEnd": "19:00",
    "placeName": "OSTRAVA – Vítkovice Aréna",
    "reservationType": "reserved",
    "playerCountTotal": 4,
    "skillMin": 1,
    "skillMax": 2
  }'
```

## 4. Poznámky

- V development módu TypeORM automaticky vytvoří tabulky (`synchronize: true`)
- Pro produkci použij migrace
- JWT token expiruje za 7 dní (lze změnit v `.env`)
- CORS je povolen pro všechny originy v developmentu - v produkci to změň

## 5. Další kroky

1. Nastav správné CORS originy pro produkci
2. Přidej rate limiting
3. Implementuj skutečné Expo Push Notifications
4. Přidej migrace pro produkční nasazení
5. Nastav environment variables pro produkci


