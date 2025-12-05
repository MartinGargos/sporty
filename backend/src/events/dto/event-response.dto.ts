import { Event } from '../entities/event.entity';
import { EventPlayer } from '../../event-players/entities/event-player.entity';

export class EventResponseDto {
  id: string;
  sportId: string;
  sportName: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  placeName: string;
  reservationType: string;
  playerCountTotal: number;
  playerCountConfirmed: number;
  skillMin: number;
  skillMax: number;
  description?: string;
  organizerName: string;
  organizerId: string;
  isMine?: boolean;
  myStatus?: 'confirmed' | 'waiting' | null;

  static fromEntity(
    event: Event,
    currentUserId?: string,
    players?: EventPlayer[],
  ): EventResponseDto {
    const confirmedCount = players?.filter((p) => p.status === 'confirmed').length || 0;
    const myPlayer = players?.find((p) => p.userId === currentUserId);

    return {
      id: event.id,
      sportId: event.sportId,
      sportName: event.sport?.name || '',
      date: event.date.toISOString().split('T')[0],
      timeStart: event.timeStart,
      timeEnd: event.timeEnd,
      placeName: event.placeName,
      reservationType: event.reservationType,
      playerCountTotal: event.playerCountTotal,
      playerCountConfirmed: confirmedCount,
      skillMin: event.skillMin,
      skillMax: event.skillMax,
      description: event.description,
      organizerName: event.organizer?.name || '',
      organizerId: event.organizerId,
      isMine: event.organizerId === currentUserId,
      myStatus: myPlayer?.status === 'confirmed' || myPlayer?.status === 'waiting' 
        ? myPlayer.status 
        : null,
    };
  }
}

