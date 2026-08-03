import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/welcoming/welcome1.png')} style={styles.image} />
      <ThemedText type="title">Welcome to HerdOS</ThemedText>
      <ThemedText type="small">Track your livestock health, location, and alerts in one app.</ThemedText>
      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={() => router.push('/onboarding/language-select')}>
          <ThemedText type="subtitle">Skip</ThemedText>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/onboarding/illness-detection')}>
          <ThemedText type="subtitle">Next</ThemedText>
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
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
    objectFit:'fill'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#1A3C2A',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
});
