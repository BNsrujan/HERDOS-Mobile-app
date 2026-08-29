import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import LanguageGrid from '@/components/onboarding/language-grid';
import { ThemedText } from '@/components/themed-text';
import { Space } from '@/constants/theme';
import { useUpdatePreferences } from '@/hooks/mutations/use-update-preferences';
import { usePreferences } from '@/hooks/queries/use-preferences';
import i18n from '@/services/i18n';

export default function LanguageSettingsScreen() {
  const { data: preferences } = usePreferences();
  const updatePreferencesMutation = useUpdatePreferences();

  const selectedLanguage = useMemo(() => preferences?.language ?? 'en', [preferences]);

  async function handleSelect(code: string) {
    await i18n.changeLanguage(code);
    updatePreferencesMutation.mutate({ language: code });
    router.back();
  }

  return (
    <ScreenContainer scroll edges={['bottom']} contentContainerStyle={styles.content}>
      <ThemedText type="small" themeColor="textSecondary">
        Choose the app language.
      </ThemedText>
      <LanguageGrid selectedLanguage={selectedLanguage} onSelect={handleSelect} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.xl,
  },
});
