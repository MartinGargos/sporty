# Nastavení lokálního PostgreSQL pro Sporty backend

## Krok 1: Instalace PostgreSQL

### Stáhni PostgreSQL

1. Jdi na https://www.postgresql.org/download/windows/
2. Stáhni PostgreSQL Installer (Windows x86-64)
3. Spusť instalátor

### Instalace (důležité kroky)

1. **Port**: Použij výchozí port **5432** (nebo si zapamatuj svůj)
2. **Heslo pro superuser (postgres)**: 
   - Nastav si heslo, například: `sporty_password`
   - ⚠️ **ZAPAMATUJ SI HO!**
3. **Lokalizace**: Zvol si locale (doporučeno `Czech, Czechia`)
4. Dokonči instalaci

### Ověření instalace

Otevři **pgAdmin 4** (instaluje se s PostgreSQL) nebo použij PowerShell:

```powershell
# Najdi PostgreSQL bin složku (obvykle)
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe --version
```

## Krok 2: Vytvoření databáze

### Možnost A: Pomocí pgAdmin 4

1. Otevři pgAdmin 4
2. Připoj se k serveru (heslo je to, které jsi zadal při instalaci)
3. Klikni pravým tlačítkem na "Databases" → "Create" → "Database"
4. Název: `sporty_db`
5. Owner: `postgres`
6. Klikni "Save"

### Možnost B: Pomocí psql (Command Line)

```powershell
# Spusť psql (nahraď 16 verzí, kterou máš)
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres

# V psql konzoli:
CREATE DATABASE sporty_db;
\q
```

## Krok 3: Aktualizace .env souboru

Uprav `backend/.env` soubor s tvými údaji:

```env
# Pokud jsi použil výchozí port a uživatele:
DATABASE_URL=postgresql://postgres:TVAJ_HESLO@localhost:5432/sporty_db

# Nebo pokud jsi změnil port:
DATABASE_URL=postgresql://postgres:TVAJ_HESLO@localhost:TVUJ_PORT/sporty_db

JWT_SECRET=super-secret-jwt-key-change-in-production-min-32-characters-long
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

**⚠️ Důležité:** Nahraď `TVAJ_HESLO` heslem, které jsi zadal při instalaci!

## Krok 4: Ověření připojení

```powershell
cd backend
npm run seed
```

Mělo by to vytvořit tabulky a seed data.

## Krok 5: Spuštění backendu

```powershell
npm run start:dev
```

Backend poběží na `http://localhost:3000`

## Řešení problémů

### Chyba: "psql is not recognized"

Přidej PostgreSQL bin složku do PATH:
1. Otevři "Environment Variables"
2. V "System variables" najdi "Path"
3. Přidej: `C:\Program Files\PostgreSQL\16\bin` (uprav verzi)

### Chyba: "password authentication failed"

Zkontroluj heslo v `.env` souboru - musí odpovídat heslu z instalace.

### Chyba: "database does not exist"

Vytvoř databázi podle Krok 2.

### PostgreSQL service neběží

```powershell
# Spusť službu
Get-Service postgresql* | Start-Service

# Nebo pomocí Services (services.msc)
# Najdi "postgresql-x64-16" a spusť ho
```

## Alternativa: SQLite (pokud PostgreSQL nefunguje)

Pokud máš problémy s PostgreSQL, můžeme použít SQLite - je jednodušší, ale má omezení.


