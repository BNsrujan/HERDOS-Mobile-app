import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { checkPhone } from '@/services/api/user';

export default function Login() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    const phone = phoneNumber.trim();
    if (!phone) {
      setError('Phone number is required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await checkPhone({ name: name.trim() || undefined, phone });
      await AsyncStorage.setItem('herdos:authPhone', phone);
      await AsyncStorage.setItem('herdos:authName', name.trim());

      if (res.exists && res.verified) {
        await AsyncStorage.setItem('herdos:loggedIn', 'true');
        router.replace('/(tabs)');
      } else {
        router.push('./verify-otp');
      }
    } catch (err) {
      console.error('login error', err);
      setError('Unable to submit login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.form}>
        <ThemedText type="subtitle">Sign in</ThemedText>
        <TextInput
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          keyboardType="default"
        />
        <TextInput
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          keyboardType="phone-pad"
        />
        {error ? <ThemedText type="small" style={styles.errorText}>{error}</ThemedText> : null}

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
            <ThemedText type="small">{loading ? 'Please wait...' : 'Submit'}</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1A3C2A',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  errorText: {
    color: '#EF4444',
  },
});
