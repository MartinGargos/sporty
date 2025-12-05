import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from './api.config';

const TOKEN_KEY = '@sporty:auth_token';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  location: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    photoUrl?: string;
    location: string;
    language: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  location: string;
  language: string;
  stats: {
    totalGames: number;
    totalHours: number;
    noShows: number;
  };
  sports: any[]; // TODO: typovat
}

class AuthService {
  private token: string | null = null;

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async removeToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při přihlášení' }));
      throw new Error(error.message || 'Chyba při přihlášení');
    }

    const data: AuthResponse = await response.json();
    await this.setToken(data.accessToken);
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při registraci' }));
      throw new Error(error.message || 'Chyba při registraci');
    }

    const data: AuthResponse = await response.json();
    await this.setToken(data.accessToken);
    return data;
  }

  async getMe(): Promise<UserProfile> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('Nejsi přihlášen');
    }

    const response = await fetch(apiUrl('/auth/me'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await this.removeToken();
      }
      throw new Error('Chyba při načítání profilu');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();


