import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type LanguageCardProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function LanguageCard({ label, selected, onSelect }: LanguageCardProps) {
  return (
    <Pressable onPress={onSelect} style={styles.pressable}>
      <ThemedView style={[styles.card, selected && styles.selected]}>
        <ThemedText type="subtitle">{label}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#3C87F7',
  },
});
