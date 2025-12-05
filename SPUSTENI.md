# 🚀 Jak spustit Sporty aplikaci

## Potřebuješ 2 terminály

### Terminál 1: Backend
```powershell
cd backend
npm run start:dev
```
✅ Backend běží na `http://localhost:3000`

### Terminál 2: Frontend  
```powershell
cd my-expo-app
npm start
```
✅ Otevře se Expo DevTools

---

## ⚡ Rychlý start

### Windows PowerShell (2 okna)

**Okno 1:**
```powershell
cd "C:\Users\marti\Desktop\GIT projekty\Sporty\my-expo-app\backend"
npm run start:dev
```

**Okno 2:**
```powershell
cd "C:\Users\marti\Desktop\GIT projekty\Sporty\my-expo-app"
npm start
```

---

## 📱 Na telefonu

1. Stáhni **Expo Go** z App Store / Google Play
2. V terminálu 2 (frontend) se zobrazí QR kód
3. Otevři Expo Go a naskenuj QR kód
4. Aplikace se načte na telefonu

---

## 🌐 IP adresa pro API

Pokud testuješ na fyzickém zařízení, musíš upravit `src/services/api.config.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.X:3000' // Tvoje IP adresa
  : 'https://api.sporty.app';
```

**Jak zjistit IP adresu:**
```powershell
ipconfig
```
Hledej **IPv4 Address** (např. `192.168.1.100`)

---

## ✅ Hotovo!

Teď máš:
- ✅ Backend běžící na portu 3000
- ✅ Frontend připravený na Expo
- ✅ Aplikaci na telefonu

Můžeš testovat! 🎉


