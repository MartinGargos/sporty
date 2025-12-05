import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { EventsProvider } from './src/context/EventsContext';
// ADD: UserProvider pro profil hráče
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      {/* UserProvider obaluje všechny obrazovky, aby měly přístup k profilu */}
      <UserProvider>
        <EventsProvider>
          <RootNavigator />
        </EventsProvider>
      </UserProvider>
    </>
  );
}   