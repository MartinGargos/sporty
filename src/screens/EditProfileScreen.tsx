import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useUser } from '../context/UserContext';
import { SkillLevel } from '../types/event';
import { SportId } from '../types/sport';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const SPORTS: { id: SportId; name: string }[] = [
  { id: 'badminton', name: 'Badminton' },
  { id: 'padel', name: 'Padel' },
  { id: 'squash', name: 'Squash' },
];

const SKILL_LEVELS: SkillLevel[] = [1, 2, 3, 4];

const skillLabel = (level: number) => {
  switch (level) {
    case 1: return 'Začátečník';
    case 2: return 'Středně pokročilý';
    case 3: return 'Pokročilý';
    case 4: return 'Profi';
    default: return `Úroveň ${level}`;
  }
};

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [sports, setSports] = useState<Record<SportId, SkillLevel>>(() => {
    const sportsMap: Record<SportId, SkillLevel> = {
      badminton: 1,
      padel: 1,
      squash: 1,
    };
    user.sports.forEach((sport) => {
      sportsMap[sport.sportId] = sport.skillLevel;
    });
    return sportsMap;
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Chyba', 'Zadej prosím jméno');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Chyba', 'Zadej prosím lokalitu');
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Zavolat API pro uložení změn
      // Pro teď jen aktualizujeme lokální state
      const updatedSports = Object.entries(sports).map(([sportId, skillLevel]) => {
        const existingSport = user.sports.find((s) => s.sportId === sportId);
        return {
          sportId: sportId as SportId,
          sportName: SPORTS.find((s) => s.id === sportId)?.name || '',
          skillLevel: skillLevel,
          gamesPlayed: existingSport?.gamesPlayed || 0,
          hoursPlayed: existingSport?.hoursPlayed || 0,
        };
      });

      setUser({
        ...user,
        name: name.trim(),
        location: location.trim(),
        sports: updatedSports,
      });

      Alert.alert('Úspěch', 'Profil byl aktualizován', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Chyba', error.message || 'Chyba při ukládání profilu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Jméno</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Tvé jméno"
          placeholderTextColor="#6b7280"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Lokalita</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Např. Ostrava, Česko"
          placeholderTextColor="#6b7280"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Skill level v jednotlivých sportech</Text>
        {SPORTS.map((sport) => (
          <View key={sport.id} style={styles.sportSection}>
            <Text style={styles.sportLabel}>{sport.name}</Text>
            <View style={styles.skillChipsRow}>
              {SKILL_LEVELS.map((level) => {
                const isActive = sports[sport.id] === level;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[styles.skillChip, isActive && styles.skillChipActive]}
                    onPress={() => {
                      setSports((prev) => ({ ...prev, [sport.id]: level }));
                    }}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        isActive && styles.skillChipTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                    {isActive && (
                      <Text style={styles.skillChipLabel}>
                        {' '}
                        - {skillLabel(level)}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#022c22" />
        ) : (
          <Text style={styles.saveButtonText}>Uložit změny</Text>
        )}
      </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
    fontSize: 15,
  },
  sportSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#0b1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sportLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  skillChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  skillChipText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '600',
  },
  skillChipTextActive: {
    color: '#022c22',
  },
  skillChipLabel: {
    color: '#022c22',
    fontSize: 12,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 16,
  },
});


