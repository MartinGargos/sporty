// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types/user';
import { mockUser } from '../data/mockUser';

type UserContextValue = {
  user: UserProfile;
  setUser: (u: UserProfile) => void; // do budoucna pro editaci profilu
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(mockUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
};
