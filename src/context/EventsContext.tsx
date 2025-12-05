import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
  } from 'react';
  import { Event, SkillLevel } from '../types/event';
  import { SportId } from '../types/sport';
  import { mockEvents } from '../data/mockEvents';
  
  type CreateEventPayload = {
    sportId: SportId;
    sportName: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    placeName: string;
    reservationType: 'reserved' | 'to_be_arranged';
    playerCountTotal: number;
    skillMin: SkillLevel;
    skillMax: SkillLevel;
    description?: string;
  };
  
  type EventsContextValue = {
    events: Event[];
    createEvent: (payload: CreateEventPayload) => void;
    updateEvent: (eventId: string, payload: CreateEventPayload) => void;
    deleteEvent: (eventId: string) => void;
  };
  
  const EventsContext = createContext<EventsContextValue | undefined>(
    undefined
  );
  
  export const EventsProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Event[]>(mockEvents);
  
    const createEvent = useCallback((payload: CreateEventPayload) => {
      const newEvent: Event = {
        id: Date.now().toString(),
        sportId: payload.sportId,
        sportName: payload.sportName,
        date: payload.date,
        timeStart: payload.timeStart,
        timeEnd: payload.timeEnd,
        placeName: payload.placeName,
        reservationType: payload.reservationType,
        playerCountTotal: payload.playerCountTotal,
        playerCountConfirmed: 1, // organizátor = ty
        skillMin: payload.skillMin,
        skillMax: payload.skillMax,
        description: payload.description,
        organizerName: 'Ty 😊',
        isMine: true,
      };
  
      setEvents((prev) => [newEvent, ...prev]);
    }, []);

    const updateEvent = useCallback((eventId: string, payload: CreateEventPayload) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
                ...event,
                sportId: payload.sportId,
                sportName: payload.sportName,
                date: payload.date,
                timeStart: payload.timeStart,
                timeEnd: payload.timeEnd,
                placeName: payload.placeName,
                reservationType: payload.reservationType,
                playerCountTotal: payload.playerCountTotal,
                skillMin: payload.skillMin,
                skillMax: payload.skillMax,
                description: payload.description,
              }
            : event
        )
      );
    }, []);

    const deleteEvent = useCallback((eventId: string) => {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    }, []);
  
    const value = useMemo(
      () => ({ events, createEvent, updateEvent, deleteEvent }),
      [events, createEvent, updateEvent, deleteEvent]
    );
  
    return (
      <EventsContext.Provider value={value}>
        {children}
      </EventsContext.Provider>
    );
  };
  
  export const useEvents = () => {
    const ctx = useContext(EventsContext);
    if (!ctx) {
      throw new Error('useEvents must be used within EventsProvider');
    }
    return ctx;
  };
  