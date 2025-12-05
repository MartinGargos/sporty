import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPlayersService } from './event-players.service';
import { EventPlayer } from './entities/event-player.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventPlayer, Event])],
  providers: [EventPlayersService],
  exports: [EventPlayersService],
})
export class EventPlayersModule {}


