import { SportId } from '../types/sport';

export interface Venue {
  id: string;
  name: string;
  city: string;
  sports: SportId[];
}

export const venues: Venue[] = [
  {
    id: 'vitkovice_arena',
    name: 'Vítkovice Aréna',
    city: 'Ostrava',
    sports: ['badminton'],
  },
  {
    id: 'padel_poruba',
    name: 'Padel Club Poruba',
    city: 'Ostrava',
    sports: ['padel'],
  },
  {
    id: 'squash_fifejdy',
    name: 'Squash centrum Fifejdy',
    city: 'Ostrava',
    sports: ['squash'],
  },
  {
    id: 'ridera_sport',
    name: 'Ridera Sport',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
  {
    id: 'sc_ostrava',
    name: 'Sport Centrum Ostrava',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
  {
    id: 'sc_fajne',
    name: 'SC Fajne',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
  {
    id: 'trojhali_karolina',
    name: 'Trojhalí Karolina',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
  {
    id: 'cdu_sport',
    name: 'CDU Sport',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
  {
    id: 'badminton_365',
    name: 'Badminton 365',
    city: 'Ostrava',
    sports: ['badminton'],
  },
  {
    id: 'sc_metalurg',
    name: 'SC Metalurg',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
  {
    id: 'tj_ostrava_varenska',
    name: 'TJ Ostrava (Varenská)',
    city: 'Ostrava',
    sports: ['badminton', 'padel', 'squash'],
  },
];
