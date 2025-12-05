import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useEvents } from '../context/EventsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MyEvents'>;

export const MyEventsScreen: React.FC<Props> = ({ navigation }) => {
    const { events } = useEvents();
  
    const myEvents = useMemo(
      () => events.filter((e) => e.isMine),
      [events]
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moje události</Text>

      {myEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Zatím nemáš žádné události. Vytvoř si první zápas na hlavní stránce.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('EventDetail', { eventId: item.id })
              }
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
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
  emptyState: {
    marginTop: 32,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
