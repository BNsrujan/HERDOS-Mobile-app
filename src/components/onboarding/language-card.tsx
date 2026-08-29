import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { MinTouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LanguageCardProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export default function LanguageCard({ label, selected, onSelect }: LanguageCardProps) {
  const theme = useTheme();

  return (
    <Card
      variant={selected ? 'tinted' : 'outlined'}
      tone={selected ? 'brand' : 'neutral'}
      onPress={onSelect}
      style={[styles.card, selected && { borderColor: theme.brand, borderWidth: 2 }]}
    >
      <ThemedText type="body">{label}</ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: MinTouchTarget,
    justifyContent: 'center',
  },
});
