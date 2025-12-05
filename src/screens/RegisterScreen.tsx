import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { authService } from '../services/auth.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validace
    if (!email.trim()) {
      Alert.alert('Chyba', 'Zadej prosím email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Chyba', 'Zadej prosím platný email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Chyba', 'Zadej prosím heslo');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Chyba', 'Heslo musí mít alespoň 6 znaků');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Chyba', 'Zadej prosím jméno');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Chyba', 'Zadej prosím lokalitu');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        email: email.trim(),
        password,
        name: name.trim(),
        location: location.trim(),
      });

      Alert.alert('Úspěch', 'Registrace proběhla úspěšně!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Home'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Chyba', error.message || 'Chyba při registraci');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrace</Text>
        <Text style={styles.subtitle}>Vytvoř si účet</Text>

        <TextInput
          style={styles.input}
          placeholder="Jméno"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Lokalita (např. Ostrava, Česko)"
          value={location}
          onChangeText={setLocation}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Heslo (min. 6 znaků)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#022c22" />
          ) : (
            <Text style={styles.buttonText}>Registrovat se</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.linkText}>Už máš účet? Přihlas se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#e5e7eb',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#022c22',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});


