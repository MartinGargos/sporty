import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { EventResponseDto } from './dto/event-response.dto';
import { EventPlayersService } from '../event-players/event-players.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventNoShow } from './entities/event-no-show.entity';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventPlayersService: EventPlayersService,
    private readonly usersService: UsersService,
    @InjectRepository(EventNoShow)
    private eventNoShowsRepository: Repository<EventNoShow>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventResponseDto> {
    return this.eventsService.create(user.id, createEventDto);
  }

  @Get()
  async findAll(@Query('my') my?: string): Promise<EventResponseDto[]> {
    // Note: @CurrentUser() nefunguje bez guardu, použijeme request pro volitelný user
    return this.eventsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyEvents(@CurrentUser() user: User): Promise<EventResponseDto[]> {
    return this.eventsService.findMyEvents(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.eventsService.findOne(id);
    const players = await this.eventPlayersService.findAllByEvent(id);

    return EventResponseDto.fromEntity(event, undefined, players);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventResponseDto> {
    return this.eventsService.update(id, user.id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.eventsService.remove(id, user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async join(@Param('id') eventId: string, @CurrentUser() user: User) {
    const result = await this.eventPlayersService.join(eventId, user.id);
    return result;
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leave(@Param('id') eventId: string, @CurrentUser() user: User) {
    await this.eventPlayersService.leave(eventId, user.id);
    return { message: 'Odhlášen ze zápasu' };
  }

  @Post(':id/no-show')
  @UseGuards(JwtAuthGuard)
  async reportNoShow(
    @Param('id') eventId: string,
    @Body() body: { userId: string },
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOne(eventId);

    // Check if user is organizer
    if (event.organizerId !== user.id) {
      throw new ForbiddenException('Pouze organizátor může označit no-show');
    }

    // Check if event has already ended (basic check - date is in past)
    const eventDate = new Date(event.date);
    const eventEndTime = event.timeEnd.split(':');
    eventDate.setHours(parseInt(eventEndTime[0]), parseInt(eventEndTime[1]));

    if (eventDate > new Date()) {
      throw new BadRequestException('Zápas ještě neskončil');
    }

    // Check if no-show already exists
    const existing = await this.eventNoShowsRepository.findOne({
      where: { eventId, userId: body.userId },
    });

    if (existing) {
      throw new ConflictException('No-show již byl označen');
    }

    // Create no-show record
    await this.eventNoShowsRepository.save({
      eventId,
      userId: body.userId,
      reportedById: user.id,
    });

    // Increment user's no-shows
    await this.usersService.incrementNoShows(body.userId);

    return { message: 'No-show označen' };
  }
}
