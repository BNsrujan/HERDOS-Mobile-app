import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

export default function IndexScreen() {
  const { hasSeenOnboarding } = useOnboardingStatus();
  const router = useRouter();

  useEffect(() => {
    if (hasSeenOnboarding === null) {
      return;
    }

    router.replace(hasSeenOnboarding ? '/(tabs)' : '/onboarding');
  }, [hasSeenOnboarding, router]);

  if (hasSeenOnboarding === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Preparing HerdOS…</ThemedText>
      </ThemedView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
