import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon, { type IconName } from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingsRowProps = {
  icon: IconName;
  label: string;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
};

export default function SettingsRow({ icon, label, right, onPress, chevron = false }: SettingsRowProps) {
  const theme = useTheme();

  return (
    <AppPressable
      onPress={onPress}
      disabled={!onPress}
      minTouchTarget={false}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={label}
      style={[styles.row, { borderBottomColor: theme.divider }]}
    >
      <View style={styles.left}>
        <Icon name={icon} size={18} />
        <ThemedText type="smallBold">{label}</ThemedText>
      </View>
      <View style={styles.right}>
        {right}
        {chevron ? <Icon name="chevron-right" size={18} color={theme.textTertiary} /> : null}
      </View>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    minHeight: MinTouchTarget,
    paddingVertical: Space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
});
