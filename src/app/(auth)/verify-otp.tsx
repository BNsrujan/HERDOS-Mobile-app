import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaxContentWidth, Space } from '@/constants/theme';
import { verifyOtp } from '@/services/api/user';

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem('herdos:authPhone').then((p) => {
      if (!p) {
        router.replace('/(auth)/login');
        return;
      }
      setPhone(p);
    });
  }, [router]);

  async function handleVerify() {
    if (!phone) {
      router.replace('/(auth)/login');
      return;
    }

    if (!otp.trim()) {
      setError('Enter the OTP sent to your phone.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const authName = await AsyncStorage.getItem('herdos:authName');
      const res = await verifyOtp({ phone, otp: otp.trim(), name: authName || undefined });
      if (res.verified) {
        if (res.token) {
          await AsyncStorage.setItem('herdos:authToken', res.token);
        }
        await AsyncStorage.setItem('herdos:loggedIn', 'true');
        router.replace('/(tabs)');
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (err) {
      console.error('verify otp error', err);
      setError('Unable to verify OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.form}>
        <ThemedText type="title">Verify phone</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          We sent an OTP to {phone ?? 'your phone'}
        </ThemedText>

        <Input
          label="One-time code"
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={6}
          errorText={error ?? undefined}
        />

        <Button size="lg" fullWidth label="Verify" loading={loading} onPress={handleVerify} />
        <Button
          variant="ghost"
          label="Back to login"
          onPress={() => router.replace('/(auth)/login')}
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
});
