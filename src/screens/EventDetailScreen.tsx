import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export const EventDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { events, deleteEvent } = useEvents();
  const { user } = useUser();
  const { eventId } = route.params;
  const [isJoined, setIsJoined] = useState(false);

  const event = useMemo(
    () => events.find((e) => e.id === eventId),
    [events, eventId]
  );

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Událost nebyla nalezena.</Text>
      </View>
    );
  }

  const isOrganizer = event.isMine || false;

  const handleJoin = () => {
    // TODO: napojení na backend, čekací listina atd.
    if (!isJoined) {
      setIsJoined(true);
      Alert.alert('Přihlášen', 'Byl jsi přihlášen na tento zápas.');
    } else {
      setIsJoined(false);
      Alert.alert('Odhlášen', 'Byl jsi odhlášen z tohoto zápasu.');
    }
  };

  const handleOpenChat = () => {
    navigation.navigate('Chat', { eventId: event.id });
  };

  const handleEdit = () => {
    navigation.navigate('EditEvent', { eventId: event.id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Smazat zápas',
      'Opravdu chceš smazat tento zápas? Tato akce je nevratná.',
      [
        {
          text: 'Zrušit',
          style: 'cancel',
        },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: () => {
            deleteEvent(eventId);
            // TODO: Zavolat API pro smazání
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const currentPlayersText = `${event.playerCountConfirmed}/${event.playerCountTotal} hráčů`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sport}>{event.sportName}</Text>
      <Text style={styles.line}>
        {event.date} · {event.timeStart}–{event.timeEnd}
      </Text>
      <Text style={styles.line}>{event.placeName}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Úroveň</Text>
        <Text style={styles.line}>
          {event.skillMin}–{event.skillMax}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hráči</Text>
        <Text style={styles.line}>{currentPlayersText}</Text>
        <Text style={styles.line}>Organizátor: {event.organizerName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rezervace kurtu</Text>
        <Text style={styles.line}>
          {event.reservationType === 'reserved'
            ? 'Kurt je zarezervovaný'
            : 'Domluvíme se a zarezervujeme později'}
        </Text>
      </View>

      {event.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popis</Text>
          <Text style={styles.line}>{event.description}</Text>
        </View>
      ) : null}

      <View style={styles.buttonsRow}>
        {isOrganizer ? (
          // Organizátor - zobrazit tlačítka pro úpravu a smazání
          <>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={handleEdit}
            >
              <Text style={styles.buttonTextEdit}>Upravit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonTextDelete}>Smazat</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Není organizátor - zobrazit tlačítka pro přihlášení/odhlášení a chat
          <>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleJoin}
            >
              <Text style={styles.buttonTextPrimary}>
                {isJoined ? 'Odhlásit se' : 'Chci hrát'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleOpenChat}
            >
              <Text style={styles.buttonTextSecondary}>Chat</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Chat tlačítko i pro organizátora */}
      {isOrganizer && (
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { marginTop: 12 }]}
          onPress={handleOpenChat}
        >
          <Text style={styles.buttonTextSecondary}>Chat</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sport: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22c55e',
    marginBottom: 4,
  },
  line: {
    color: '#9ca3af',
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  buttonsRow: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  buttonTextPrimary: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextEdit: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextDelete: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#e5e7eb',
    fontWeight: '500',
    fontSize: 16,
  },
  errorText: {
    color: '#f97373',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
