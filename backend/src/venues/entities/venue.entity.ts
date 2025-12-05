import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Sport } from '../../sports/entities/sport.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => Sport)
  @JoinTable({
    name: 'venue_sports',
    joinColumn: { name: 'venue_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'sport_id', referencedColumnName: 'id' },
  })
  sports: Sport[];
}


