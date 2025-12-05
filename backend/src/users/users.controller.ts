import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventPlayer } from '../event-players/entities/event-player.entity';
import { Event } from '../events/entities/event.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    @InjectRepository(EventPlayer)
    private eventPlayersRepository: Repository<EventPlayer>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  @Get('stats')
  async getStats(@CurrentUser() user: User) {
    // Get all confirmed participations
    const participations = await this.eventPlayersRepository.find({
      where: { userId: user.id, status: 'confirmed' },
      relations: ['event'],
    });

    // Calculate stats
    const totalGames = participations.length;

    let totalHours = 0;
    participations.forEach((p) => {
      if (p.event) {
        const [startHours, startMinutes] = p.event.timeStart.split(':').map(Number);
        const [endHours, endMinutes] = p.event.timeEnd.split(':').map(Number);
        const start = startHours * 60 + startMinutes;
        const end = endHours * 60 + endMinutes;
        const duration = (end - start) / 60; // in hours
        totalHours += duration;
      }
    });

    return {
      totalGames,
      totalHours: Math.round(totalHours),
      noShows: user.noShows,
    };
  }

  @Post('push-token')
  async savePushToken(
    @CurrentUser() user: User,
    @Body() body: { deviceToken: string; platform: 'ios' | 'android' | 'web' },
  ) {
    await this.notificationsService.savePushToken(user.id, body.deviceToken, body.platform);
    return { message: 'Push token uložen' };
  }
}
