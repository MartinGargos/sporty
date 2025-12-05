import { apiUrl } from './api.config';
import { authService } from './auth.service';
import { Event } from '../types/event';
import { CreateEventPayload } from '../context/EventsContext';

class EventsService {
  private async getAuthHeaders() {
    const token = await authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getEvents(myEvents?: boolean): Promise<Event[]> {
    const headers = await this.getAuthHeaders();
    const url = myEvents ? apiUrl('/events/my') : apiUrl('/events');
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Chyba při načítání zápasů');
    }

    const events: any[] = await response.json();
    
    // Transform backend response to frontend Event format
    return events.map((e) => ({
      id: e.id,
      sportId: e.sportId,
      sportName: e.sportName,
      date: e.date,
      timeStart: e.timeStart,
      timeEnd: e.timeEnd,
      placeName: e.placeName,
      reservationType: e.reservationType,
      playerCountTotal: e.playerCountTotal,
      playerCountConfirmed: e.playerCountConfirmed,
      skillMin: e.skillMin,
      skillMax: e.skillMax,
      description: e.description,
      organizerName: e.organizerName,
      isMine: e.isMine,
      myStatus: e.myStatus, // 'confirmed' | 'waiting' | null
    }));
  }

  async getEventById(id: string): Promise<Event> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${id}`), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('Zápas nenalezen');
    }

    const e = await response.json();
    
    return {
      id: e.id,
      sportId: e.sportId,
      sportName: e.sportName,
      date: e.date,
      timeStart: e.timeStart,
      timeEnd: e.timeEnd,
      placeName: e.placeName,
      reservationType: e.reservationType,
      playerCountTotal: e.playerCountTotal,
      playerCountConfirmed: e.playerCountConfirmed,
      skillMin: e.skillMin,
      skillMax: e.skillMax,
      description: e.description,
      organizerName: e.organizerName,
      isMine: e.isMine,
      myStatus: e.myStatus,
    };
  }

  async createEvent(payload: CreateEventPayload): Promise<Event> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl('/events'), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sportId: payload.sportId,
        date: payload.date,
        timeStart: payload.timeStart,
        timeEnd: payload.timeEnd,
        placeName: payload.placeName,
        reservationType: payload.reservationType,
        playerCountTotal: payload.playerCountTotal,
        skillMin: payload.skillMin,
        skillMax: payload.skillMax,
        description: payload.description,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při vytváření zápasu' }));
      throw new Error(error.message || 'Chyba při vytváření zápasu');
    }

    const e = await response.json();
    
    return {
      id: e.id,
      sportId: e.sportId,
      sportName: e.sportName,
      date: e.date,
      timeStart: e.timeStart,
      timeEnd: e.timeEnd,
      placeName: e.placeName,
      reservationType: e.reservationType,
      playerCountTotal: e.playerCountTotal,
      playerCountConfirmed: e.playerCountConfirmed,
      skillMin: e.skillMin,
      skillMax: e.skillMax,
      description: e.description,
      organizerName: e.organizerName,
      isMine: e.isMine,
      myStatus: e.myStatus,
    };
  }

  async updateEvent(id: string, updates: Partial<CreateEventPayload>): Promise<Event> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${id}`), {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při úpravě zápasu' }));
      throw new Error(error.message || 'Chyba při úpravě zápasu');
    }

    const e = await response.json();
    return this.transformEvent(e);
  }

  async deleteEvent(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${id}`), {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Chyba při mazání zápasu');
    }
  }

  async joinEvent(eventId: string): Promise<{ status: 'confirmed' | 'waiting' }> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${eventId}/join`), {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při přihlašování' }));
      throw new Error(error.message || 'Chyba při přihlašování');
    }

    return response.json();
  }

  async leaveEvent(eventId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${eventId}/leave`), {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při odhlašování' }));
      throw new Error(error.message || 'Chyba při odhlašování');
    }
  }

  async reportNoShow(eventId: string, userId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(apiUrl(`/events/${eventId}/no-show`), {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Chyba při označení no-show' }));
      throw new Error(error.message || 'Chyba při označení no-show');
    }
  }

  private transformEvent(e: any): Event {
    return {
      id: e.id,
      sportId: e.sportId,
      sportName: e.sportName,
      date: e.date,
      timeStart: e.timeStart,
      timeEnd: e.timeEnd,
      placeName: e.placeName,
      reservationType: e.reservationType,
      playerCountTotal: e.playerCountTotal,
      playerCountConfirmed: e.playerCountConfirmed,
      skillMin: e.skillMin,
      skillMax: e.skillMax,
      description: e.description,
      organizerName: e.organizerName,
      isMine: e.isMine,
      myStatus: e.myStatus,
    };
  }
}

export const eventsService = new EventsService();


