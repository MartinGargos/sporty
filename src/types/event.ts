import { SportId } from './sport';

export type SkillLevel = 1 | 2 | 3 | 4;

export interface Event {
  id: string;
  sportId: SportId;
  sportName: string;
  date: string;       // YYYY-MM-DD
  timeStart: string;  // HH:MM
  timeEnd: string;    // HH:MM
  placeName: string;
  reservationType: 'reserved' | 'to_be_arranged';
  playerCountTotal: number;
  playerCountConfirmed: number;
  skillMin: SkillLevel;
  skillMax: SkillLevel;
  description?: string;
  organizerName: string;
  isMine?: boolean;
  // do budoucna eventStatus atd.
}
