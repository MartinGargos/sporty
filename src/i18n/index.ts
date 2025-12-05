// Struktura pro lokalizaci (CZ/EN)
// Pro implementaci použij react-i18next nebo podobnou knihovnu

export type LanguageCode = 'cs' | 'en';

export const translations = {
  cs: {
    // Auth
    login: 'Přihlásit se',
    register: 'Registrovat se',
    email: 'E-mail',
    password: 'Heslo',
    name: 'Jméno',
    location: 'Lokalita',
    
    // Events
    events: 'Zápasy',
    upcomingEvents: 'Nadcházející zápasy',
    myEvents: 'Moje události',
    createEvent: 'Vytvořit zápas',
    eventDetail: 'Detail zápasu',
    sport: 'Sport',
    date: 'Datum',
    time: 'Čas',
    place: 'Místo',
    players: 'Hráči',
    skillLevel: 'Úroveň',
    join: 'Chci hrát',
    leave: 'Odhlásit se',
    confirmed: 'POTVRZENÝ',
    waiting: 'ČEKACÍ LISTINA',
    
    // Profile
    profile: 'Profil hráče',
    statistics: 'Statistiky',
    totalGames: 'Odehraných zápasů',
    totalHours: 'Odehraných hodin',
    noShows: 'No-show',
    
    // Chat
    chat: 'Chat',
    sendMessage: 'Odeslat zprávu',
    enterMessage: 'Zadej zprávu...',
  },
  en: {
    // Auth
    login: 'Log in',
    register: 'Sign up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    location: 'Location',
    
    // Events
    events: 'Events',
    upcomingEvents: 'Upcoming events',
    myEvents: 'My events',
    createEvent: 'Create event',
    eventDetail: 'Event detail',
    sport: 'Sport',
    date: 'Date',
    time: 'Time',
    place: 'Place',
    players: 'Players',
    skillLevel: 'Skill level',
    join: 'Join',
    leave: 'Leave',
    confirmed: 'CONFIRMED',
    waiting: 'WAITING LIST',
    
    // Profile
    profile: 'Player profile',
    statistics: 'Statistics',
    totalGames: 'Games played',
    totalHours: 'Hours played',
    noShows: 'No-shows',
    
    // Chat
    chat: 'Chat',
    sendMessage: 'Send message',
    enterMessage: 'Enter message...',
  },
};

// Jednoduchý helper pro získání překladu
// V produkci použij react-i18next
export const t = (key: string, lang: LanguageCode = 'cs'): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
};


