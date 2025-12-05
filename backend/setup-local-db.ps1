# PowerShell script pro nastaveni lokalni PostgreSQL databaze

Write-Host "=== Nastaveni lokalni PostgreSQL databaze ===" -ForegroundColor Cyan
Write-Host ""

# Kontrola, jestli PostgreSQL je nainstalovany
$postgresPath = "C:\Program Files\PostgreSQL"
if (-not (Test-Path $postgresPath)) {
    Write-Host "[ERROR] PostgreSQL neni nalezen v $postgresPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Stahni a nainstaluj PostgreSQL z:" -ForegroundColor Yellow
    Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Po instalaci spust tento skript znovu." -ForegroundColor Yellow
    exit 1
}

# Najdi nejnovejsi verzi
$pgVersions = Get-ChildItem $postgresPath -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match '^\d+$' }

if (-not $pgVersions) {
    Write-Host "[ERROR] Zadna verze PostgreSQL neni nalezena" -ForegroundColor Red
    exit 1
}

$latestVersion = $pgVersions | Sort-Object Name -Descending | Select-Object -First 1
$psqlPath = Join-Path $latestVersion.FullName "bin\psql.exe"

Write-Host "[OK] PostgreSQL nalezen: $($latestVersion.Name)" -ForegroundColor Green
Write-Host ""

# Zkus najit psql.exe
if (-not (Test-Path $psqlPath)) {
    Write-Host "[ERROR] psql.exe neni nalezen v $psqlPath" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] psql.exe nalezen" -ForegroundColor Green
Write-Host ""

# Pozadej o heslo
$password = Read-Host "Zadej heslo pro PostgreSQL uzivatele 'postgres' (nebo Enter pro vychozi 'sporty_password')"
if ([string]::IsNullOrWhiteSpace($password)) {
    $password = "sporty_password"
}

# Nastav environment variable pro heslo
$env:PGPASSWORD = $password

Write-Host ""
Write-Host "Vytvareni databaze 'sporty_db'..." -ForegroundColor Cyan

# Zkus vytvorit databazi
$createDbCommand = "SELECT 1 FROM pg_database WHERE datname = 'sporty_db';"
$checkResult = & $psqlPath -U postgres -tAc $createDbCommand 2>&1

if ($checkResult -match "1") {
    Write-Host "[OK] Databaze 'sporty_db' jiz existuje" -ForegroundColor Green
} else {
    $createResult = & $psqlPath -U postgres -c "CREATE DATABASE sporty_db;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Databaze 'sporty_db' vytvorena" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Chyba pri vytvareni databaze:" -ForegroundColor Yellow
        Write-Host $createResult -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Zkus vytvorit databazi manualne:" -ForegroundColor Yellow
        Write-Host "  cd `"$($latestVersion.FullName)\bin`"" -ForegroundColor Yellow
        Write-Host "  .\psql.exe -U postgres" -ForegroundColor Yellow
        Write-Host "  CREATE DATABASE sporty_db;" -ForegroundColor Yellow
    }
}

# Vytvor nebo aktualizuj .env soubor
Write-Host ""
Write-Host "Aktualizace .env souboru..." -ForegroundColor Cyan

$envContent = "DATABASE_URL=postgresql://postgres:$password@localhost:5432/sporty_db`nJWT_SECRET=super-secret-jwt-key-change-in-production-min-32-characters-long`nJWT_EXPIRES_IN=7d`nPORT=3000`nNODE_ENV=development`n"

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host "[OK] .env soubor vytvoren/aktualizovan" -ForegroundColor Green
Write-Host ""

# Overeni pripojeni
Write-Host "Testovani pripojeni k databazi..." -ForegroundColor Cyan

$testConnection = & $psqlPath -U postgres -d sporty_db -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Pripojeni k databazi funguje!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Nyni muzes spustit:" -ForegroundColor Cyan
    Write-Host "  npm run seed" -ForegroundColor Yellow
    Write-Host "  npm run start:dev" -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] Pripojeni selhalo:" -ForegroundColor Red
    Write-Host $testConnection -ForegroundColor Red
    Write-Host ""
    Write-Host "Zkontroluj:" -ForegroundColor Yellow
    Write-Host "  1. Ze PostgreSQL service bezi" -ForegroundColor Yellow
    Write-Host "  2. Ze heslo v .env je spravne" -ForegroundColor Yellow
}

# Vycisti heslo z pameti
$env:PGPASSWORD = ""
