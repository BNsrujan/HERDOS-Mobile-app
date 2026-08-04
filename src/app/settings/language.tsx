import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import LanguageGrid from '@/components/onboarding/language-grid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Language</ThemedText>
        <ThemedText type="small">Choose the app language.</ThemedText>
      </View>

      <LanguageGrid selectedLanguage={selectedLanguage} onSelect={handleSelect} />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ThemedText type="smallBold">Back</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    gap: 8,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
});
