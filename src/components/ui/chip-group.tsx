import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppPressable } from '@/components/ui/pressable';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  dotColor?: string;
};

export type ChipGroupProps<T extends string> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Horizontal ScrollView when true, a static wrapping row when false. */
  scrollable?: boolean;
};

/**
 * Replaces the two divergent chip implementations. `scrollable` is the only real
 * behavioural difference between them, so the merge is lossless.
 */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  scrollable = false,
}: ChipGroupProps<T>) {
  const theme = useTheme();

  const chips = options.map((option) => {
    const selected = option.value === value;

    return (
      <AppPressable
        key={option.value}
        onPress={() => onChange(option.value)}
        accessibilityState={{ selected }}
        accessibilityLabel={option.label}
        minTouchTarget={false}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? theme.surfaceInverse : theme.surfaceSunken,
          },
        ]}
      >
        {option.dotColor ? <View style={[styles.dot, { backgroundColor: option.dotColor }]} /> : null}
        <ThemedText
          type="smallBold"
          style={{ color: selected ? theme.textInverse : theme.textSecondary }}
        >
          {option.label}
        </ThemedText>
      </AppPressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {chips}
      </ScrollView>
    );
  }

  return <View style={styles.row}>{chips}</View>;
}

const styles = StyleSheet.create({
  scroll: {
    gap: Space.sm,
    paddingVertical: Space.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    minHeight: 40,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.lg,
    borderRadius: Radius.full,
    
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
});
