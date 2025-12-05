# Jak spustit Sporty aplikaci

## 🚀 Spuštění aplikace

Aplikace se skládá ze **dvou částí**, které musí běžet současně:

### 1️⃣ Backend (API server)

**Terminál 1:**
```powershell
cd backend
npm run start:dev
```

Backend poběží na: `http://localhost:3000`

✅ Mělo by se zobrazit: `🚀 Sporty backend běží na portu 3000`

---

### 2️⃣ Frontend (Expo app)

**Terminál 2** (nové okno PowerShell):
```powershell
cd ..
npm start
```

Nebo:
```powershell
cd my-expo-app
npm start
```

✅ Otevře se Expo DevTools v prohlížeči

---

## 📱 Co dál?

1. **Expo Go na telefonu**: Naskenuj QR kód z terminálu
2. **Emulátor**: Stiskni `a` pro Android, `i` pro iOS
3. **Web**: Stiskni `w` pro web verzi

---

## ⚙️ Nastavení API URL

Ujisti se, že frontend ví, kde najít backend!

V souboru `src/services/api.config.ts` nastav:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.X:3000' // IP adresa tvého počítače
  : 'https://api.sporty.app';
```

**⚠️ Důležité:** Pro testování na fyzickém zařízení:
- Použij IP adresu počítače (ne `localhost`)
- Zjisti IP příkazem: `ipconfig` (hledej IPv4 adresu)

---

## 🔧 Řešení problémů

### Backend neběží
- Zkontroluj, že PostgreSQL běží
- Zkontroluj `.env` soubor v `backend/`
- Zkontroluj port 3000 - není obsazený?

### Frontend se nemůže připojit k backendu
- Zkontroluj IP adresu v `api.config.ts`
- Zkontroluj, že backend běží na portu 3000
- Zkontroluj firewall - může blokovat připojení

---

## 📝 Příklad workflow

1. **Otevři 2 terminály**
2. **Terminál 1**: `cd backend && npm run start:dev`
3. **Terminál 2**: `cd my-expo-app && npm start`
4. **Na telefonu**: Otevři Expo Go a naskenuj QR kód

Hotovo! 🎉


