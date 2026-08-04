import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import LanguageCard from '@/components/onboarding/language-card';

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

type LanguageGridProps = {
  selectedLanguage: string;
  onSelect: (code: string) => void;
};

export default function LanguageGrid({ selectedLanguage, onSelect }: LanguageGridProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.list}>
        {languages.map((language) => (
          <LanguageCard
            key={language.code}
            label={language.label}
            selected={language.code === selectedLanguage}
            onSelect={() => onSelect(language.code)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 12,
  },
  list: {
    gap: 12,
  },
});
