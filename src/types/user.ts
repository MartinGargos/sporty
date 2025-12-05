// src/types/user.ts
import { SportId } from './sport';
import { SkillLevel } from './event';

export type LanguageCode = 'cs' | 'en';

export interface UserSportStats {
  sportId: SportId;
  sportName: string;
  skillLevel: SkillLevel;
  gamesPlayed: number;
  hoursPlayed: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  location: string;
  language: LanguageCode;
  stats: {
    totalGames: number;
    totalHours: number;
    noShows: number;
  };
  sports: UserSportStats[];
}
