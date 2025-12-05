import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

export type SportId = 'badminton' | 'padel' | 'squash';

@Entity('sports')
export class Sport {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: SportId;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


