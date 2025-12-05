import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventPlayer, EventPlayerStatus } from './entities/event-player.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class EventPlayersService {
  constructor(
    @InjectRepository(EventPlayer)
    private eventPlayersRepository: Repository<EventPlayer>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private dataSource: DataSource,
  ) {}

  async join(eventId: string, userId: string): Promise<{ status: EventPlayerStatus }> {
    // Check if event exists
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Zápas nenalezen');
    }

    // Check if user is already a player
    const existingPlayer = await this.eventPlayersRepository.findOne({
      where: { eventId, userId },
    });

    if (existingPlayer) {
      if (existingPlayer.status === 'removed') {
        // Allow re-joining if previously removed
        existingPlayer.status = 'waiting';
        existingPlayer.waitingPosition = null;
        await this.eventPlayersRepository.save(existingPlayer);
        return { status: 'waiting' };
      }
      throw new ConflictException('Již jsi přihlášen na tento zápas');
    }

    // Check if user is organizer
    if (event.organizerId === userId) {
      throw new BadRequestException('Organizátor je již automaticky přihlášen');
    }

    // Count confirmed players
    const confirmedCount = await this.eventPlayersRepository.count({
      where: { eventId, status: 'confirmed' },
    });

    let status: EventPlayerStatus = 'confirmed';
    let waitingPosition: number | null = null;

    // Check if there's space
    if (confirmedCount >= event.playerCountTotal) {
      // No space, add to waiting list
      status = 'waiting';
      
      // Get next waiting position
      const maxWaiting = await this.eventPlayersRepository
        .createQueryBuilder('ep')
        .select('MAX(ep.waitingPosition)', 'max')
        .where('ep.eventId = :eventId', { eventId })
        .andWhere('ep.status = :status', { status: 'waiting' })
        .getRawOne();

      waitingPosition = (maxWaiting?.max || 0) + 1;
    }

    // Create player record
    const player = this.eventPlayersRepository.create({
      eventId,
      userId,
      status,
      waitingPosition,
    });

    await this.eventPlayersRepository.save(player);

    return { status };
  }

  async leave(eventId: string, userId: string): Promise<void> {
    const player = await this.eventPlayersRepository.findOne({
      where: { eventId, userId },
    });

    if (!player) {
      throw new NotFoundException('Nejsi přihlášen na tento zápas');
    }

    // Check if user is organizer
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (event?.organizerId === userId) {
      throw new BadRequestException('Organizátor se nemůže odhlásit');
    }

    const wasConfirmed = player.status === 'confirmed';
    const waitingPosition = player.waitingPosition;

    // Remove player
    await this.eventPlayersRepository.remove(player);

    // If was confirmed, promote first waiting player
    if (wasConfirmed) {
      await this.promoteFirstWaiting(eventId);
    } else if (waitingPosition) {
      // If was waiting, update positions
      await this.updateWaitingPositions(eventId, waitingPosition);
    }
  }

  private async promoteFirstWaiting(eventId: string): Promise<void> {
    const firstWaiting = await this.eventPlayersRepository.findOne({
      where: { eventId, status: 'waiting' },
      order: { waitingPosition: 'ASC' },
    });

    if (firstWaiting) {
      firstWaiting.status = 'confirmed';
      firstWaiting.waitingPosition = null;
      await this.eventPlayersRepository.save(firstWaiting);

      // Update remaining waiting positions
      await this.updateWaitingPositions(eventId, 1);
    }
  }

  private async updateWaitingPositions(eventId: string, removedPosition: number): Promise<void> {
    // Decrement positions after removed one
    await this.eventPlayersRepository
      .createQueryBuilder()
      .update(EventPlayer)
      .set({
        waitingPosition: () => 'waiting_position - 1',
      })
      .where('eventId = :eventId', { eventId })
      .andWhere('status = :status', { status: 'waiting' })
      .andWhere('waitingPosition > :position', { position: removedPosition })
      .execute();
  }

  async getPlayerStatus(eventId: string, userId: string): Promise<EventPlayerStatus | null> {
    const player = await this.eventPlayersRepository.findOne({
      where: { eventId, userId },
    });

    return player?.status || null;
  }

  async findAllByEvent(eventId: string): Promise<EventPlayer[]> {
    return this.eventPlayersRepository.find({
      where: { eventId },
      relations: ['user'],
      order: {
        status: 'ASC',
        waitingPosition: 'ASC',
      },
    });
  }
}

