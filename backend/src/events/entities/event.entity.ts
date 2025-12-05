import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Sport, SportId } from '../../sports/entities/sport.entity';
import { Venue } from '../../venues/entities/venue.entity';
import { EventPlayer } from '../../event-players/entities/event-player.entity';
import { ChatMessage } from '../../chat/entities/chat-message.entity';

export type ReservationType = 'reserved' | 'to_be_arranged';
export type SkillLevel = 1 | 2 | 3 | 4;

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organizer_id' })
  organizerId: string;

  @Column({ name: 'sport_id', type: 'varchar', length: 50 })
  sportId: SportId;

  @Column({ name: 'venue_id', nullable: true })
  venueId?: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'time_start', type: 'time' })
  timeStart: string; // HH:MM format

  @Column({ name: 'time_end', type: 'time' })
  timeEnd: string; // HH:MM format

  @Column({ name: 'place_name' })
  placeName: string;

  @Column({ name: 'reservation_type', type: 'varchar', length: 20 })
  reservationType: ReservationType;

  @Column({ name: 'player_count_total' })
  playerCountTotal: number;

  @Column({ name: 'skill_min' })
  skillMin: SkillLevel;

  @Column({ name: 'skill_max' })
  skillMax: SkillLevel;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @ManyToOne(() => Sport)
  @JoinColumn({ name: 'sport_id' })
  sport: Sport;

  @ManyToOne(() => Venue, { nullable: true })
  @JoinColumn({ name: 'venue_id' })
  venue?: Venue;

  @OneToMany(() => EventPlayer, (eventPlayer) => eventPlayer.event)
  players: EventPlayer[];

  @OneToMany(() => ChatMessage, (message) => message.event)
  messages: ChatMessage[];
}


