# Instalace PostgreSQL lokálně (Windows)

## Krok 1: Stáhni PostgreSQL

1. Otevři: **https://www.postgresql.org/download/windows/**
2. Klikni na **"Download the installer"**
3. Vyber **PostgreSQL 16** (nebo nejnovější verzi)
4. Stáhni **Windows x86-64** verzi

## Krok 2: Instalace

1. **Spusť instalátor** (např. `postgresql-16.x-windows-x64.exe`)

2. **Installation Directory**: 
   - Výchozí: `C:\Program Files\PostgreSQL\16`
   - Můžeš nechat výchozí

3. **Select Components**:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (grafický nástroj)
   - ✅ Stack Builder (volitelné)
   - ✅ Command Line Tools (důležité!)

4. **Data Directory**:
   - Výchozí: `C:\Program Files\PostgreSQL\16\data`
   - Můžeš nechat výchozí

5. **Password** (DŮLEŽITÉ!):
   - Zadej heslo pro superuser `postgres`
   - Například: `sporty_password`
   - **⚠️ ZAPAMATUJ SI HO!**

6. **Port**: 
   - Výchozí: **5432**
   - Nech výchozí

7. **Advanced Options**:
   - Locale: Vyber **Czech, Czechia** nebo **English, United States**

8. **Ready to Install**: Klikni **Next** a počkej na instalaci

9. **Completing**: 
   - ✅ Leave unchecked "Launch Stack Builder"
   - Klikni **Finish**

## Krok 3: Ověření instalace

Otevři **pgAdmin 4** z nabídky Start. Měl by se otevřít v prohlížeči.

## Krok 4: Spuštění setup skriptu

Po instalaci spusť v PowerShell:

```powershell
cd backend
.\setup-local-db.ps1
```

Skript:
- Vytvoří databázi `sporty_db`
- Nastaví `.env` soubor

## Krok 5: Seed databáze

```powershell
npm run seed
```

## Krok 6: Spuštění backendu

```powershell
npm run start:dev
```

## Alternativa: SQLite (jednodušší, ale má omezení)

Pokud máš problémy s PostgreSQL instalací, můžeme použít SQLite - nevyžaduje instalaci a je jednodušší pro vývoj.

---

**Pomoc**: Pokud máš problémy s instalací, napiš co konkrétně nefunguje.


