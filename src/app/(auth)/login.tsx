import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaxContentWidth, Space } from '@/constants/theme';
import { ApiError } from '@/services/api/client';
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
      await checkPhone({ name: name.trim() || undefined, phone });
      await AsyncStorage.setItem('herdos:authPhone', phone);
      await AsyncStorage.setItem('herdos:authName', name.trim());
      router.push('/(auth)/verify-otp');
    } catch (err) {
      console.error('login error', err);
      // The API sends a usable reason for rate limits ("please wait before
      // requesting another code"); a generic message hides it and leaves the
      // farmer tapping a button that cannot work yet.
      setError(
        err instanceof ApiError && err.status === 429
          ? err.message
          : 'Unable to submit login. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.form}>
        <ThemedText type="title">Sign in</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          We will text you a one-time code to confirm your number.
        </ThemedText>

        <Input
          label="Full name"
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          textContentType="name"
        />
        <Input
          label="Phone number"
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          errorText={error ?? undefined}
        />

        <Button
          size="lg"
          fullWidth
          label="Submit"
          loading={loading}
          onPress={handleSubmit}
          style={styles.submit}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    maxWidth: MaxContentWidth / 2,
    alignSelf: 'center',
    gap: Space.lg,
  },
  submit: {
    marginTop: Space.sm,
  },
});
