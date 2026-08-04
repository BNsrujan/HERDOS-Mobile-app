import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { AnimalStatus } from '@/types/animal';

const filterOptions: Array<{ label: string; value: AnimalStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Watch', value: 'watch' },
  { label: 'Alert', value: 'alert' },
  { label: 'Milking', value: 'milking' },
  { label: 'Pregnant', value: 'pregnant' },
];

type FilterChipsProps = {
  value: AnimalStatus | 'all';
  onChange: (value: AnimalStatus | 'all') => void;
};

export default function FilterChips({ value, onChange }: FilterChipsProps) {
  const theme = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {filterOptions.map((option) => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.chip,
              {
                borderColor: theme.backgroundSelected,
                backgroundColor: active ? theme.backgroundSelected : 'transparent',
              },
            ]}
          >
            <Text style={[styles.label, { color: active ? theme.text : theme.textSecondary }]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    gap: Spacing.two,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
