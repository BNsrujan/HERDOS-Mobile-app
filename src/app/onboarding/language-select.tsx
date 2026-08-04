import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import LanguageCard from '@/components/onboarding/language-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOnboardingStatus } from '@/hooks/use-onboarding-status';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'kn', label: 'Kannada' },
  { code: 'mr', label: 'Marathi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'gu', label: 'Gujarati' },
];

export default function LanguageSelectScreen() {
  const { markOnboardingSeen } = useOnboardingStatus();
  const router = useRouter();
  const selectedLanguage = useMemo(() => languages[0].code, []);

  async function handleSelect() {
    await markOnboardingSeen();
    router.replace('/(auth)/login');
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Choose Language</ThemedText>
        <ThemedText type="small">Select your preferred language to continue.</ThemedText>
      </ThemedView>

      <View style={styles.list}>
        {languages.map((language) => (
          <LanguageCard
            key={language.code}
            label={language.label}
            selected={language.code === selectedLanguage}
            onSelect={handleSelect}
          />
        ))}
      </View>

      <Pressable style={styles.continueButton} onPress={handleSelect}>
        <ThemedView style={styles.continueButtonInner}>
          <ThemedText type="link">Continue</ThemedText>
        </ThemedView>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    gap: 12,
    marginBottom: 24,
  },
  list: {
    gap: 12,
  },
  continueButton: {
    marginTop: 24,
  },
  continueButtonInner: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
});
