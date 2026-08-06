import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

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
    <ThemedView style={styles.container}>
      <View style={styles.form}>
        <ThemedText type="subtitle">Verify phone</ThemedText>
        <ThemedText type="small">We sent an OTP to {phone ?? 'your phone'}</ThemedText>
        <TextInput
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          keyboardType="number-pad"
        />
        {error ? <ThemedText type="small" style={styles.errorText}>{error}</ThemedText> : null}
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={handleVerify} disabled={loading}>
            <ThemedText type="small" style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</ThemedText>
          </Pressable>
        </View>
        <Pressable style={styles.linkButton} onPress={() => router.replace('/(auth)/login')}>
          <ThemedText type="link">Back to login</ThemedText>
        </Pressable>
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
    marginTop: 12,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1A3C2A',
  },
  linkButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
  },
  buttonText:{
    color: '#FFF'
  }
});
