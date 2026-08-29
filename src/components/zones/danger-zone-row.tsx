import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { DangerZone } from '@/types/zone';

type DangerZoneRowProps = {
  zone: DangerZone;
  onPress: () => void;
};

export default function DangerZoneRow({ zone, onPress }: DangerZoneRowProps) {
  const theme = useTheme();

  return (
    <AppPressable
      onPress={onPress}
      accessibilityLabel={`Show ${zone.name} on map`}
      minTouchTarget={false}
      style={styles.row}
    >
      <View style={[styles.border, { backgroundColor: theme.danger }]} />
      <View style={[styles.iconWrap, { backgroundColor: theme.dangerSubtle }]}>
        <Icon name="warning" size={16} color={theme.onDangerSubtle} />
      </View>
      <ThemedText type="smallBold" numberOfLines={1}>
        {zone.name}
      </ThemedText>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    minHeight: MinTouchTarget,
    paddingVertical: Space.sm,
  },
  border: {
    width: 3,
    height: 28,
    borderRadius: Radius.full,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
