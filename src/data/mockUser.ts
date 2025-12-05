// src/data/mockUser.ts
import { UserProfile } from '../types/user';

export const mockUser: UserProfile = {
  id: 'user_1',
  name: 'Martin G.',
  email: 'martin@example.com',
  location: 'Ostrava, Česko',
  language: 'cs',
  photoUrl: undefined,
  stats: {
    totalGames: 42,
    totalHours: 65,
    noShows: 1,
  },
  sports: [
    {
      sportId: 'badminton',
      sportName: 'Badminton',
      skillLevel: 2,
      gamesPlayed: 20,
      hoursPlayed: 30,
    },
    {
      sportId: 'padel',
      sportName: 'Padel',
      skillLevel: 3,
      gamesPlayed: 15,
      hoursPlayed: 25,
    },
    {
      sportId: 'squash',
      sportName: 'Squash',
      skillLevel: 1,
      gamesPlayed: 7,
      hoursPlayed: 10,
    },
  ],
};
