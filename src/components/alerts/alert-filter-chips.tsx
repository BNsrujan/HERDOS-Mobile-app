import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export type AlertFilter = 'all' | 'active' | 'resolved';

type AlertFilterChipsProps = {
  value: AlertFilter;
  onChange: (value: AlertFilter) => void;
};

const filters: Array<{ value: AlertFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
];

export default function AlertFilterChips({ value, onChange }: AlertFilterChipsProps) {
  return (
    <View style={styles.row}>
      {filters.map((filter) => {
        const isActive = value === filter.value;

        return (
          <TouchableOpacity
            key={filter.value}
            accessibilityRole="button"
            onPress={() => onChange(filter.value)}
            style={[styles.chip, isActive && styles.activeChip]}
          >
            <ThemedText type="smallBold" style={[styles.label, isActive && styles.activeLabel]}>
              {filter.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  activeChip: {
    backgroundColor: '#111827',
  },
  label: {
    color: '#4B5563',
  },
  activeLabel: {
    color: '#fff',
  },
});
