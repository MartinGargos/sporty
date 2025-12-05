import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { EventPlayersModule } from './event-players/event-players.module';
import { ChatModule } from './chat/chat.module';
import { SportsModule } from './sports/sports.module';
import { VenuesModule } from './venues/venues.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    EventPlayersModule,
    ChatModule,
    SportsModule,
    VenuesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
