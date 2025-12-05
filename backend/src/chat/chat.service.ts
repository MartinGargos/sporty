import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessagesRepository: Repository<ChatMessage>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async createMessage(
    eventId: string,
    userId: string,
    message: string,
  ): Promise<ChatMessage> {
    // Verify event exists
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Zápas nenalezen');
    }

    const chatMessage = this.chatMessagesRepository.create({
      eventId,
      userId,
      message: message.trim(),
    });

    return this.chatMessagesRepository.save(chatMessage);
  }

  async findAllByEvent(eventId: string): Promise<ChatMessage[]> {
    return this.chatMessagesRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { sentAt: 'ASC' },
    });
  }
}


