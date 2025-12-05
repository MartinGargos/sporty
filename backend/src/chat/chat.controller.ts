import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('events/:eventId/messages')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getMessages(@Param('eventId') eventId: string) {
    const messages = await this.chatService.findAllByEvent(eventId);
    return messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      sentAt: msg.sentAt,
      userId: msg.userId,
      userName: msg.user?.name || '',
      userPhotoUrl: msg.user?.photoUrl,
    }));
  }

  @Post()
  async sendMessage(
    @Param('eventId') eventId: string,
    @Body() body: { message: string },
    @CurrentUser() user: User,
  ) {
    const message = await this.chatService.createMessage(eventId, user.id, body.message);
    return {
      id: message.id,
      message: message.message,
      sentAt: message.sentAt,
      userId: message.userId,
      userName: user.name,
      userPhotoUrl: user.photoUrl,
    };
  }
}


