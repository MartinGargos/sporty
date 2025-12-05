import React, { useMemo, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SportId } from '../types/sport';
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';
import { Event } from '../types/event';


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const SPORTS_FILTER: { id: SportId | 'all'; label: string }[] = [
  { id: 'all', label: 'Vše' },
  { id: 'badminton', label: 'Badminton' },
  { id: 'padel', label: 'Padel' },
  { id: 'squash', label: 'Squash' },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { events } = useEvents();
    const { user } = useUser();
    const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');
  
    // Vytvoření inicialů stejně jako v ProfileScreen
    const initials = user.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  
    // Format jména: "Jméno P." (první jméno, první písmeno příjmení, tečka)
    const formatUserName = (name: string): string => {
      const parts = name.trim().split(/\s+/).filter(p => p.length > 0);
      if (parts.length === 0) return '';
      const firstName = parts[0];
      if (parts.length > 1) {
        // Vezmi poslední část a první písmeno (bez tečky pokud tam je)
        const lastName = parts[parts.length - 1].replace(/\./g, '');
        const lastNameInitial = lastName[0]?.toUpperCase() || '';
        return lastNameInitial ? `${firstName} ${lastNameInitial}.` : firstName;
      }
      return firstName;
    };

    const formattedName = formatUserName(user.name);
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.headerProfileButton}
            activeOpacity={0.7}
          >
            <View style={styles.headerAvatar}>
              {user.photoUrl ? (
                <Text style={styles.headerAvatarText}>📷</Text>
              ) : (
                <Text style={styles.headerAvatarInitials}>{initials}</Text>
              )}
            </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateEvent')}
            style={styles.headerCreateButton}
            activeOpacity={0.7}
          >
            <View style={styles.headerCreateButtonInner}>
              <Text style={styles.headerCreateButtonText}>+</Text>
            </View>
          </TouchableOpacity>
        ),
      });
    }, [navigation, user, initials]);
  
    const filteredEvents = useMemo(() => {
      if (selectedSport === 'all') return events;
      return events.filter((e: Event) => e.sportId === selectedSport);
    }, [selectedSport, events]);
    
  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeHeader}>
          <View>
            <Text style={styles.welcomeText}>Ahoj, {user.name.split(' ')[0]} 👋</Text>
            <Text style={styles.welcomeSubtext}>{new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyEvents')}
            style={styles.myEventsButton}
          >
            <Text style={styles.myEventsIcon}>📅</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Nadcházející zápasy</Text>
      </View>
      <View style={styles.filtersRow}>
        {SPORTS_FILTER.map((sport) => {
          const isActive = selectedSport === sport.id;
          return (
            <TouchableOpacity
              key={sport.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedSport(sport.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {sport.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              console.log('Navigating to EventDetail with id', item.id);
              navigation.navigate('EventDetail', { eventId: item.id });
            }}
          >
            <Text style={styles.sport}>{item.sportName}</Text>
            <Text style={styles.line}>
              {item.date} · {item.timeStart}–{item.timeEnd}
            </Text>
            <Text style={styles.line}>{item.placeName}</Text>
            <Text style={styles.line}>
              Úroveň: {item.skillMin}–{item.skillMax}
            </Text>
            <Text style={styles.players}>
              {item.playerCountConfirmed}/{item.playerCountTotal} hráčů
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  filterChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  filterChipText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  filterChipTextActive: {
    color: '#022c22',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#0b1120',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sport: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 4,
  },
  line: {
    color: '#9ca3af',
    fontSize: 14,
  },
  players: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#e5e7eb',
  },
  myEventsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0b1120',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myEventsIcon: {
    fontSize: 20,
  },
  headerProfileButton: {
    marginLeft: 4,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 16,
  },
  headerAvatarInitials: {
    color: '#022c22',
    fontSize: 16,
    fontWeight: '700',
  },
  headerCreateButton: {
    marginRight: 4,
  },
  headerCreateButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerCreateButtonText: {
    color: '#022c22',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
});
