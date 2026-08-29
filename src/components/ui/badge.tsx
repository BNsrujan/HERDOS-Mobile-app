import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Space, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BadgeProps = {
  label: string;
  tone?: Tone;
  variant?: 'subtle' | 'solid';
};

export function Badge({ label, tone = 'neutral', variant = 'subtle' }: BadgeProps) {
  const theme = useTheme();

  const palette =
    tone === 'neutral'
      ? { subtle: theme.surfaceSunken, on: theme.textSecondary, solid: theme.surfaceInverse, onSolid: theme.textInverse }
      : {
          brand: { subtle: theme.brandSubtle, on: theme.brandOnSubtle, solid: theme.brand, onSolid: theme.brandText },
          success: { subtle: theme.successSubtle, on: theme.onSuccessSubtle, solid: theme.success, onSolid: '#FFFFFF' },
          warning: { subtle: theme.warningSubtle, on: theme.onWarningSubtle, solid: theme.warning, onSolid: '#FFFFFF' },
          danger: { subtle: theme.dangerSubtle, on: theme.onDangerSubtle, solid: theme.danger, onSolid: '#FFFFFF' },
          info: { subtle: theme.infoSubtle, on: theme.onInfoSubtle, solid: theme.info, onSolid: '#FFFFFF' },
        }[tone];

  const backgroundColor = variant === 'solid' ? palette.solid : palette.subtle;
  const color = variant === 'solid' ? palette.onSolid : palette.on;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText type="overline" style={{ color }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Space.xs,
    paddingHorizontal: Space.sm,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
});
