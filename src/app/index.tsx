import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function IndexScreen() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function initialize() {
      const seen = await AsyncStorage.getItem('herdos:onboardingSeen');
      const logged = await AsyncStorage.getItem('herdos:loggedIn');
      setHasSeenOnboarding(seen === 'true');
      setIsLoggedIn(logged === 'true');
    }

    initialize();
  }, []);

  useEffect(() => {
    if (hasSeenOnboarding === null || isLoggedIn === null) {
      return;
    }

    if (!hasSeenOnboarding) {
      router.replace('/onboarding');
      return;
    }

    router.replace(isLoggedIn ? '/(tabs)' : '/(auth)/login');
  }, [hasSeenOnboarding, isLoggedIn, router]);

  if (hasSeenOnboarding === null || isLoggedIn === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Preparing HerdOS</ThemedText>
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
    paddingTop: 48,
    backgroundColor: '#fff',
  },
});
