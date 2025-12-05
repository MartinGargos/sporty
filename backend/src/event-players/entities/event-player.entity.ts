import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';

export type EventPlayerStatus = 'confirmed' | 'waiting' | 'removed';

@Entity('event_players')
@Unique(['eventId', 'userId'])
@Index(['status', 'waitingPosition'])
export class EventPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  status: EventPlayerStatus;

  @Column({ name: 'waiting_position', nullable: true })
  waitingPosition?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Event, (event) => event.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User, (user) => user.eventPlayers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}


