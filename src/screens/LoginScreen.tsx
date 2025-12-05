import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { authService } from '../services/auth.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
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

    setIsLoading(true);

    try {
      await authService.login({
        email: email.trim(),
        password,
      });

      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Chyba', error.message || 'Chyba při přihlášení');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sporty</Text>
      <Text style={styles.subtitle}>Najdi spoluhráče na raketové sporty</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Heslo"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#022c22" />
        ) : (
          <Text style={styles.buttonText}>Přihlásit se</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
        disabled={isLoading}
      >
        <Text style={styles.linkText}>Nemáš účet? Registrovat se</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={isLoading}>
        <Text style={styles.linkTextSmall}>Zapomenuté heslo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 24,
    justifyContent: 'center',
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
    fontSize: 15,
  },
  linkTextSmall: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
});
