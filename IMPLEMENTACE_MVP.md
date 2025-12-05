# Kompletní implementace MVP - Sporty

## 📦 Co je implementováno

### Backend (NestJS + PostgreSQL)

✅ **Kompletní backend API** - Všechny endpointy pro MVP
- Autentizace (JWT)
- CRUD operace pro zápasy
- Přihlašování na zápasy s čekací listinou
- Chat systém
- No-show systém
- Statistiky hráčů
- Struktura pro notifikace

### Frontend Services vrstva

✅ **API Services** - Připraveno pro napojení
- `authService` - Autentizace
- `eventsService` - Zápasy
- `chatService` - Chat

### Dokumentace

✅ **Kompletní dokumentace**
- Databázový model
- API dokumentace
- Průvodce implementací
- Frontend integrace

## 🚧 Co ještě zbývá dokončit

### 1. Frontend integrace

**Předpokládaný čas: 2-4 hodiny**

- [ ] Přidat `@react-native-async-storage/async-storage` do dependencies
- [ ] Vytvořit `AuthContext` který používá `authService`
- [ ] Aktualizovat `EventsContext` aby používal `eventsService` místo mocků
- [ ] Napojit `LoginScreen` na reálné API
- [ ] Aktualizovat `EventDetailScreen` - tlačítko Join/Leave
- [ ] Aktualizovat `CreateEventScreen` - odesílání na API
- [ ] Aktualizovat `MyEventsScreen` - načítání z API

**Soubory k úpravě:**
- `src/context/AuthContext.tsx` (nový)
- `src/context/EventsContext.tsx` (upravit)
- `src/screens/LoginScreen.tsx`
- `src/screens/EventDetailScreen.tsx`
- `src/screens/CreateEventScreen.tsx`
- `src/screens/MyEventsScreen.tsx`

### 2. Chat Screen integrace

**Předpokládaný čas: 30 minut**

- [ ] Opravit `ChatScreen.tsx` - načítání aktuálního uživatele
- [ ] Napojit tlačítko "Chat" v `EventDetailScreen` na `ChatScreen`
- [ ] Otestovat odesílání a načítání zpráv

**Soubory:**
- `src/screens/ChatScreen.tsx` (už vytvořen, potřebuje drobné úpravy)
- `src/screens/EventDetailScreen.tsx` (přidat navigaci na Chat)

### 3. Expo Push Notifications

**Předpokládaný čas: 1-2 hodiny**

- [ ] Instalace `expo-notifications`
- [ ] Implementace registrace push tokenu při přihlášení
- [ ] Integrace Expo Push Notification API v backendu
- [ ] Odeslání notifikací při:
  - Potvrzení účasti na zápase
  - Přesunu z čekací listiny
  - Připomínka 2 hodiny před začátkem (cron job)

**Soubory:**
- `src/services/notifications.service.ts` (nový)
- `backend/src/notifications/notifications.service.ts` (doplnit Expo API)

### 4. Lokalizace (i18n)

**Předpokládaný čas: 1-2 hodiny**

- [ ] Instalace `react-i18next` a `i18next`
- [ ] Implementace provideru pro jazyky
- [ ] Překlad všech textů v aplikaci
- [ ] Přepínač jazyka v profilu

**Soubory:**
- `src/i18n/` (struktura už připravena)
- Všechny screens (použití `t()` funkce)

### 5. Ostatní vylepšení

- [ ] Error handling a loading stavy
- [ ] Refresh na pull (pull-to-refresh)
- [ ] Offline handling (volitelné)
- [ ] Realtime chat přes WebSockets (nice-to-have)

## 📋 Postup implementace

### Krok 1: Backend setup

```bash
cd backend
npm install
# Vytvoř .env soubor
npm run seed
npm run start:dev
```

### Krok 2: Frontend - Instalace dependencies

```bash
npm install @react-native-async-storage/async-storage
```

### Krok 3: Frontend - API konfigurace

V `src/services/api.config.ts` změň `API_BASE_URL` na IP adresu tvého počítače (pro testování na fyzickém zařízení).

### Krok 4: Postupná integrace

1. **Auth** - Nejdřív napoj autentizaci
2. **Events** - Pak zápasy
3. **Chat** - Nakonec chat

## 🎯 Priorita

1. **Vysoká**: Frontend integrace (body 1-2)
2. **Střední**: Chat screen (body 3)
3. **Nízká**: Push notifications a lokalizace (body 4-5)

## 📚 Zdrojové soubory

### Backend dokumentace
- `backend/README.md` - Struktura backendu
- `backend/DATABASE_SCHEMA.md` - Databázový model
- `backend/IMPLEMENTATION_GUIDE.md` - Průvodce setupem
- `backend/SUMMARY.md` - Shrnutí implementace

### Frontend dokumentace
- `FRONTEND_INTEGRATION.md` - Jak napojit frontend

### Obecné
- `IMPLEMENTACE_MVP.md` - Tento soubor

## ✨ Hotovo!

Všechny základní soubory a struktury jsou připraveny. Teď už jen napojit frontend na backend a otestovat! 🚀


