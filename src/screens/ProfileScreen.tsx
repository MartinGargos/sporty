// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useUser } from '../context/UserContext';
import { authService } from '../services/auth.service';
import { LanguageCode } from '../types/user';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const skillLabel = (level: number) => {
  switch (level) {
    case 1:
      return 'Začátečník';
    case 2:
      return 'Středně pokročilý';
    case 3:
      return 'Pokročilý';
    case 4:
      return 'Profi';
    default:
      return `Úroveň ${level}`;
  }
};

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [language, setLanguage] = useState<LanguageCode>(user.language || 'cs');

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLanguageChange = (isEnglish: boolean) => {
    const newLang: LanguageCode = isEnglish ? 'en' : 'cs';
    setLanguage(newLang);
    setUser({ ...user, language: newLang });
    // TODO: Uložit do API
  };

  const handleLogout = () => {
    Alert.alert(
      'Odhlásit se',
      'Opravdu se chceš odhlásit?',
      [
        {
          text: 'Zrušit',
          style: 'cancel',
        },
        {
          text: 'Odhlásit se',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error: any) {
              Alert.alert('Chyba', error.message || 'Chyba při odhlašování');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.location}>{user.location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiky</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.stats.totalGames}</Text>
            <Text style={styles.statLabel}>Odehraných zápasů</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.stats.totalHours}</Text>
            <Text style={styles.statLabel}>Odehraných hodin</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.stats.noShows}</Text>
            <Text style={styles.statLabel}>No-show</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sporty</Text>
        {user.sports.map((sport) => (
          <View key={sport.sportId} style={styles.sportCard}>
            <View style={styles.sportHeader}>
              <Text style={styles.sportName}>{sport.sportName}</Text>
              <Text style={styles.skillBadge}>{skillLabel(sport.skillLevel)}</Text>
            </View>
            <Text style={styles.sportText}>
              Zápasy: {sport.gamesPlayed} · Hodiny: {sport.hoursPlayed}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nastavení</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>✏️</Text>
            <View>
              <Text style={styles.settingTitle}>Editovat profil</Text>
              <Text style={styles.settingSubtitle}>Změna jména, lokality a skill levelu</Text>
            </View>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🌐</Text>
            <View style={styles.languageContainer}>
              <Text style={styles.settingTitle}>Jazyk aplikace</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'cs' && styles.languageButtonActive,
                  ]}
                  onPress={() => handleLanguageChange(false)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      language === 'cs' && styles.languageButtonTextActive,
                    ]}
                  >
                    🇨🇿 Čeština
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'en' && styles.languageButtonActive,
                  ]}
                  onPress={() => handleLanguageChange(true)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      language === 'en' && styles.languageButtonTextActive,
                    ]}
                  >
                    🇬🇧 English
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔔</Text>
            <View>
              <Text style={styles.settingTitle}>Notifikace</Text>
              <Text style={styles.settingSubtitle}>Nastavení upozornění</Text>
            </View>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <View>
              <Text style={styles.settingTitle}>O aplikaci</Text>
              <Text style={styles.settingSubtitle}>Verze a informace</Text>
            </View>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Odhlásit se</Text>
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
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#022c22',
    fontSize: 24,
    fontWeight: '700',
  },
  headerText: {
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  location: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0b1120',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  sportCard: {
    backgroundColor: '#0b1120',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  skillBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    color: '#022c22',
    fontWeight: '600',
  },
  sportText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0b1120',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
  settingArrow: {
    fontSize: 24,
    color: '#9ca3af',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  languageContainer: {
    flex: 1,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  languageButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  languageButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  languageButtonTextActive: {
    color: '#022c22',
    fontWeight: '600',
  },
});
