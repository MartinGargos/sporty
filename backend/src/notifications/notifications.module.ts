import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { UserPushToken } from '../users/entities/user-push-token.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPushToken, User])],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}


