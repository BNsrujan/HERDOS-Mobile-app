import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Radius, Space } from '@/constants/theme';
import type { HerdAlert } from '@/types/alert';
import { getAlertBody, getAlertPresentation, getAlertTitle } from '@/utils/alert-display';
import { formatRelativeTime } from '@/utils/format-time';

type AlertRowProps = {
  alert: HerdAlert;
  onResolve: () => void;
  isResolving?: boolean;
};

export default function AlertRow({ alert, onResolve, isResolving }: AlertRowProps) {
  const { Icon, color } = getAlertPresentation(alert);
  const resolved = Boolean(alert.acknowledged);

  return (
    <Card variant={resolved ? 'sunken' : 'elevated'} padding="md" style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}22` }]}>
            <Icon size={16} color={color} strokeWidth={2.25} />
          </View>
          <View style={styles.titleBlock}>
            <ThemedText type="smallBold" numberOfLines={1}>
              {getAlertTitle(alert)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {getAlertBody(alert)}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="caption" themeColor="textSecondary">
          {formatRelativeTime(alert.createdAt)}
        </ThemedText>
      </View>

      <View style={styles.footerRow}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.stateText}>
          {resolved ? 'Resolved' : 'Needs attention'}
        </ThemedText>
        <Button
          size="sm"
          label={resolved ? 'Resolved' : 'Resolve'}
          loading={isResolving}
          disabled={resolved}
          onPress={onResolve}
          accessibilityLabel={`Resolve alert for ${getAlertTitle(alert)}`}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space.md,
    marginBottom: Space.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    gap: Space.sm,
  },
  titleBlock: {
    flex: 1,
    gap: Space.xs,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Space.md,
  },
  stateText: {
    flex: 1,
  },
});
