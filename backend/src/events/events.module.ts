import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventNoShow } from './entities/event-no-show.entity';
import { EventPlayer } from '../event-players/entities/event-player.entity';
import { Sport } from '../sports/entities/sport.entity';
import { EventPlayersModule } from '../event-players/event-players.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Sport, EventPlayer, EventNoShow]),
    EventPlayersModule,
    UsersModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

