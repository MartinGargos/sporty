# Rychlý start - Lokální PostgreSQL

## ⚡ Rychlý setup (pokud máš PostgreSQL nainstalovaný)

### Krok 1: Automatický setup

```powershell
cd backend
.\setup-local-db.ps1
```

Tento skript:
- Najde tvůj PostgreSQL
- Vytvoří databázi `sporty_db`
- Vytvoří/aktualizuje `.env` soubor

### Krok 2: Seed databáze

```powershell
npm run seed
```

### Krok 3: Spusť backend

```powershell
npm run start:dev
```

## 📥 Pokud nemáš PostgreSQL

1. **Stáhni PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Nainstaluj** (port 5432, heslo si zvol)
3. **Spusť** `.\setup-local-db.ps1`
4. **Pokračuj** kroky 2-3 výše

## 🔧 Manuální setup

Pokud automatický skript nefunguje, postupuj podle `LOCAL_POSTGRESQL_SETUP.md`


