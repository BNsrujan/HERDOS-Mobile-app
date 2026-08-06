import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import LanguageGrid from '@/components/onboarding/language-grid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

export default function LanguageSelectScreen() {
  const { markOnboardingSeen } = useOnboardingStatus();
  const router = useRouter();
  const selectedLanguage = useMemo(() => 'en', []);

  async function handleSelect(code: string) {
    await markOnboardingSeen();
    if (code) {
      router.replace('/(auth)/login');
    }
  }

  return (
    <ThemedView style={styles.content}>
      <ThemedText type="subtitle">Choose Language</ThemedText>
      <ThemedText type="small">Select your preferred language to continue.</ThemedText>

      <LanguageGrid selectedLanguage={selectedLanguage} onSelect={handleSelect} />

      <Pressable style={styles.continueButton} onPress={() => handleSelect(selectedLanguage)}>
        <ThemedView style={styles.continueButtonInner}>
          <ThemedText type="link" style={styles.buttonText}>
            Continue
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  continueButton: {
    marginTop: 24,
  },
  continueButtonInner: {
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 14,
      backgroundColor: '#1A3C2A',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      textAlign: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
