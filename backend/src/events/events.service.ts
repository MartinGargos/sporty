import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventPlayer } from '../event-players/entities/event-player.entity';
import { Sport } from '../sports/entities/sport.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Sport)
    private sportsRepository: Repository<Sport>,
    @InjectRepository(EventPlayer)
    private eventPlayersRepository: Repository<EventPlayer>,
  ) {}

  async create(userId: string, createEventDto: CreateEventDto): Promise<EventResponseDto> {
    // Validate sport exists
    const sport = await this.sportsRepository.findOne({
      where: { id: createEventDto.sportId as any },
    });
    if (!sport) {
      throw new BadRequestException('Sport neexistuje');
    }

    // Validate date is in future
    const eventDate = new Date(createEventDto.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (eventDate < now) {
      throw new BadRequestException('Datum musí být v budoucnosti');
    }

    // Validate time start < time end
    const [startHours, startMinutes] = createEventDto.timeStart.split(':').map(Number);
    const [endHours, endMinutes] = createEventDto.timeEnd.split(':').map(Number);
    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;
    if (startTime >= endTime) {
      throw new BadRequestException('Čas začátku musí být před časem konce');
    }

    // Validate skill min <= skill max
    if (createEventDto.skillMin > createEventDto.skillMax) {
      throw new BadRequestException('Minimální úroveň nesmí být vyšší než maximální');
    }

    // Create event
    const event = this.eventsRepository.create({
      sportId: createEventDto.sportId as any,
      venueId: createEventDto.venueId,
      date: eventDate,
      timeStart: createEventDto.timeStart,
      timeEnd: createEventDto.timeEnd,
      placeName: createEventDto.placeName,
      reservationType: createEventDto.reservationType,
      playerCountTotal: createEventDto.playerCountTotal,
      skillMin: createEventDto.skillMin as any,
      skillMax: createEventDto.skillMax as any,
      description: createEventDto.description,
      organizerId: userId,
    });

    const savedEvent = await this.eventsRepository.save(event);

    // Load relations for response
    const eventWithRelations = await this.findOne(savedEvent.id, userId);

    // Add organizer as confirmed player
    await this.eventPlayersRepository.save({
      eventId: savedEvent.id,
      userId: userId,
      status: 'confirmed',
    });

    return EventResponseDto.fromEntity(eventWithRelations, userId);
  }

  async findAll(userId?: string): Promise<EventResponseDto[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await this.eventsRepository.find({
      where: {
        date: MoreThanOrEqual(today),
      },
      relations: ['organizer', 'sport'],
      order: {
        date: 'ASC',
        timeStart: 'ASC',
      },
    });

    // Load players for each event
    const eventsWithPlayers = await Promise.all(
      events.map(async (event) => {
        const players = await this.eventPlayersRepository.find({
          where: { eventId: event.id },
        });
        return EventResponseDto.fromEntity(event, userId, players);
      }),
    );

    return eventsWithPlayers;
  }

  async findOne(id: string, userId?: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'sport', 'venue'],
    });

    if (!event) {
      throw new NotFoundException('Zápas nenalezen');
    }

    return event;
  }

  async update(
    id: string,
    userId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventResponseDto> {
    const event = await this.findOne(id);

    // Check if user is organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Pouze organizátor může upravit zápas');
    }

    // Validate date if provided
    const dateValue = 'date' in updateEventDto ? updateEventDto.date as string | undefined : undefined;
    if (dateValue) {
      const eventDate = new Date(dateValue);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (eventDate < now) {
        throw new BadRequestException('Datum musí být v budoucnosti');
      }
    }

    // Validate times if provided
    const timeStart = 'timeStart' in updateEventDto ? updateEventDto.timeStart : undefined;
    const timeEnd = 'timeEnd' in updateEventDto ? updateEventDto.timeEnd : undefined;
    
    if (timeStart && timeEnd) {
      const [startHours, startMinutes] = timeStart.split(':').map(Number);
      const [endHours, endMinutes] = timeEnd.split(':').map(Number);
      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;
      if (startTime >= endTime) {
        throw new BadRequestException('Čas začátku musí být před časem konce');
      }
    }

    // Update event
    if (dateValue) {
      event.date = new Date(dateValue);
    }
    if (timeStart) {
      event.timeStart = timeStart;
    }
    if (timeEnd) {
      event.timeEnd = timeEnd;
    }
    
    // Update other fields if provided
    if ('sportId' in updateEventDto && updateEventDto.sportId) {
      event.sportId = updateEventDto.sportId as any;
    }
    if ('venueId' in updateEventDto) {
      event.venueId = updateEventDto.venueId;
    }
    if ('placeName' in updateEventDto && updateEventDto.placeName) {
      event.placeName = updateEventDto.placeName;
    }
    if ('reservationType' in updateEventDto && updateEventDto.reservationType) {
      event.reservationType = updateEventDto.reservationType;
    }
    if ('playerCountTotal' in updateEventDto && updateEventDto.playerCountTotal !== undefined) {
      event.playerCountTotal = updateEventDto.playerCountTotal;
    }
    if ('skillMin' in updateEventDto && updateEventDto.skillMin !== undefined) {
      event.skillMin = updateEventDto.skillMin as any;
    }
    if ('skillMax' in updateEventDto && updateEventDto.skillMax !== undefined) {
      event.skillMax = updateEventDto.skillMax as any;
    }
    if ('description' in updateEventDto) {
      event.description = updateEventDto.description;
    }

    const updatedEvent = await this.eventsRepository.save(event);
    const eventWithRelations = await this.findOne(updatedEvent.id, userId);
    const players = await this.eventPlayersRepository.find({
      where: { eventId: updatedEvent.id },
    });

    return EventResponseDto.fromEntity(eventWithRelations, userId, players);
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.findOne(id);

    // Check if user is organizer
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Pouze organizátor může smazat zápas');
    }

    await this.eventsRepository.remove(event);
  }

  async findMyEvents(userId: string): Promise<EventResponseDto[]> {
    // Find events where user is organizer or participant
    const playerEvents = await this.eventPlayersRepository.find({
      where: { userId, status: 'confirmed' },
      relations: ['event', 'event.organizer', 'event.sport'],
    });

    const organizedEvents = await this.eventsRepository.find({
      where: { organizerId: userId },
      relations: ['organizer', 'sport'],
    });

    // Combine and deduplicate
    const allEvents = new Map<string, Event>();
    organizedEvents.forEach((e) => allEvents.set(e.id, e));
    playerEvents.forEach((p) => {
      if (p.event) {
        allEvents.set(p.event.id, p.event);
      }
    });

    const eventsArray = Array.from(allEvents.values());

    // Load players for each event
    const eventsWithPlayers = await Promise.all(
      eventsArray.map(async (event) => {
        const players = await this.eventPlayersRepository.find({
          where: { eventId: event.id },
        });
        return EventResponseDto.fromEntity(event, userId, players);
      }),
    );

    // Sort by date
    return eventsWithPlayers.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }
}

