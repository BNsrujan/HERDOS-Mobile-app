import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/favicon/web-app-manifest-512x512.png')} style={styles.image} />
      <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
        Welcome to HerdOS
      </ThemedText>
      <ThemedText type="small" style={{ textAlign: 'center' }}>
        Track your livestock health, location, and alerts in one app.
      </ThemedText>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/onboarding/illness-detection')}>
          <ThemedText type="linkPrimary"  style={styles.buttonText}>
            Next
          </ThemedText>
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
    gap: 12,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    
    objectFit: 'contain',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#1A3C2A',
  },

  buttonText: {
    color: '#FFFFFF',
  },
});
