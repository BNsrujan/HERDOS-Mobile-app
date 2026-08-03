import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'herdos:onboardingSeen';

export function useOnboardingStatus() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => setHasSeenOnboarding(value === 'true'))
      .catch(() => setHasSeenOnboarding(false));
  }, []);

  const markOnboardingSeen = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setHasSeenOnboarding(true);
  }, []);

  return {
    hasSeenOnboarding,
    markOnboardingSeen,
  };
}
