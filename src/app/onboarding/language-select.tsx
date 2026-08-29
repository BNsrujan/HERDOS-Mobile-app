import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import LanguageGrid from '@/components/onboarding/language-grid';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Space } from '@/constants/theme';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';
import i18n from '@/services/i18n';

export default function LanguageSelectScreen() {
  const { markOnboardingSeen } = useOnboardingStatus();
  const router = useRouter();
  // Previously hardcoded to 'en', so the user's choice was collected and discarded.
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  async function handleContinue() {
    await i18n.changeLanguage(selectedLanguage);
    await markOnboardingSeen();
    router.replace('/(auth)/login');
  }

  return (
    <ScreenContainer style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText type="title">Choose Language</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Select your preferred language to continue.
      </ThemedText>

      <LanguageGrid selectedLanguage={selectedLanguage} onSelect={setSelectedLanguage} />

      <Button size="lg" fullWidth label="Continue" onPress={handleContinue} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  content: {
    gap: Space.md,
  },
});
