import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { EventPlayer } from '../../event-players/entities/event-player.entity';

export type LanguageCode = 'cs' | 'en';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl?: string;

  @Column()
  location: string;

  @Column({ type: 'varchar', length: 2, default: 'cs' })
  language: LanguageCode;

  @Column({ name: 'no_shows', default: 0 })
  noShows: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Event, (event) => event.organizer)
  organizedEvents: Event[];

  @OneToMany(() => EventPlayer, (eventPlayer) => eventPlayer.user)
  eventPlayers: EventPlayer[];
}


