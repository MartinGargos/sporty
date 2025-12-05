import { apiUrl } from './api.config';
import { authService } from './auth.service';

export interface ChatMessage {
  id: string;
  message: string;
  sentAt: Date;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
}

class ChatService {
  private async getAuthHeaders() {
    const token = await authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getMessages(eventId: string): Promise<ChatMessage[]> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${eventId}/messages`), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Chyba při načítání zpráv');
    }

    const messages: any[] = await response.json();
    
    return messages.map((m) => ({
      id: m.id,
      message: m.message,
      sentAt: new Date(m.sentAt),
      userId: m.userId,
      userName: m.userName,
      userPhotoUrl: m.userPhotoUrl,
    }));
  }

  async sendMessage(eventId: string, message: string): Promise<ChatMessage> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${eventId}/messages`), {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při odesílání zprávy' }));
      throw new Error(error.message || 'Chyba při odesílání zprávy');
    }

    const m = await response.json();
    
    return {
      id: m.id,
      message: m.message,
      sentAt: new Date(m.sentAt),
      userId: m.userId,
      userName: m.userName,
      userPhotoUrl: m.userPhotoUrl,
    };
  }
}

export const chatService = new ChatService();


