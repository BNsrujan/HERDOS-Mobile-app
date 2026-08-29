import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { FenceZone } from '@/types/zone';

type ZoneCardProps = {
  zone: FenceZone;
  onEdit: () => void;
  onToggle: (active: boolean) => void;
};

export default function ZoneCard({ zone, onEdit, onToggle }: ZoneCardProps) {
  const theme = useTheme();

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.row}>
        <View
          style={[styles.swatch, { backgroundColor: zone.active ? theme.accent : theme.textTertiary }]}
        />
        <View style={styles.textBlock}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {zone.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {zone.animalCount} animals inside
          </ThemedText>
        </View>

        <View
          style={[
            styles.pill,
            { backgroundColor: zone.active ? theme.successSubtle : theme.surfaceSunken },
          ]}
        >
          <ThemedText
            type="overline"
            style={{ color: zone.active ? theme.onSuccessSubtle : theme.textSecondary }}
          >
            {zone.active ? 'Active' : 'Paused'}
          </ThemedText>
        </View>

        <AppPressable
          onPress={onEdit}
          accessibilityLabel={`Edit ${zone.name}`}
          style={[styles.editButton, { backgroundColor: theme.surfaceSunken }]}
        >
          <Icon name="edit" size={16} />
        </AppPressable>
      </View>

      <View style={styles.toggleRow}>
        <Switch
          value={zone.active}
          onValueChange={onToggle}
          accessibilityLabel={`${zone.name} enabled`}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Space.md,
    marginBottom: Space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: Radius.xs,
  },
  textBlock: {
    flex: 1,
  },
  pill: {
    paddingHorizontal: Space.sm,
    paddingVertical: Space.xs,
    borderRadius: Radius.full,
  },
  editButton: {
    width: MinTouchTarget - 10,
    height: MinTouchTarget - 10,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    alignItems: 'flex-end',
  },
});
