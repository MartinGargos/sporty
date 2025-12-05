# Integrace frontendu s backendem

## 1. Instalace závislostí

```bash
npm install @react-native-async-storage/async-storage
```

## 2. Aktualizace API konfigurace

V `src/services/api.config.ts` změň `API_BASE_URL` podle potřeby:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://192.168.1.X:3000' // IP adresa tvého počítače
  : 'https://api.sporty.app';
```

**Důležité:** Pro testování na fyzickém zařízení použij IP adresu počítače, ne `localhost`.

## 3. Aktualizace Auth Contextu

Vytvoř nový AuthContext, který bude používat `authService`:

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '../services/auth.service';
import { UserProfile } from '../types/user';

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (await authService.isAuthenticated()) {
        const userData = await authService.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await AuthResponse = await authService.login({ email, password });
    const userData = await authService.getMe();
    setUser(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
```

## 4. Aktualizace Events Contextu

Uprav `EventsContext` aby používal `eventsService` místo mock dat:

```typescript
// Aktualizuj src/context/EventsContext.tsx
import { eventsService } from '../services/events.service';
import { useAuth } from './AuthContext';

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventsService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = useCallback(async (payload: CreateEventPayload) => {
    if (!isAuthenticated) {
      throw new Error('Musíš být přihlášen');
    }
    
    const newEvent = await eventsService.createEvent(payload);
    setEvents((prev) => [newEvent, ...prev]);
  }, [isAuthenticated]);

  // ... další metody
};
```

## 5. Aktualizace Login Screenu

```typescript
// V LoginScreen.tsx
const handleLogin = async () => {
  try {
    await login(email, password);
    navigation.navigate('Home');
  } catch (error) {
    Alert.alert('Chyba', error.message || 'Chyba při přihlášení');
  }
};
```

## 6. Aktualizace Event Detail Screenu

```typescript
// V EventDetailScreen.tsx
const handleJoin = async () => {
  try {
    const result = await eventsService.joinEvent(eventId);
    if (result.status === 'confirmed') {
      Alert.alert('Přihlášen', 'Byl jsi potvrzen na tento zápas.');
    } else {
      Alert.alert('Čekací listina', 'Jsi na čekací listině. Dostaneš notifikaci, pokud se uvolní místo.');
    }
    // Refresh event data
  } catch (error) {
    Alert.alert('Chyba', error.message || 'Chyba při přihlašování');
  }
};
```

## 7. Vytvoření Chat Screenu

Vytvoř `src/screens/ChatScreen.tsx` (struktura viz další sekce).

## 8. Postup implementace

1. ✅ Backend struktura a entity
2. ✅ Auth endpointy
3. ✅ Events API
4. ⏳ Napojení frontendu na API
5. ⏳ Chat screen
6. ⏳ Notifikace
7. ⏳ Lokalizace


