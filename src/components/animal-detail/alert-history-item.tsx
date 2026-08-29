import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon from '@/components/ui/icon';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { HerdAlert } from '@/types/alert';
import { getAlertBody } from '@/utils/alert-display';
import { formatRelativeTime } from '@/utils/format-time';

export default function AlertHistoryItem({ alert }: { alert: HerdAlert }) {
  const theme = useTheme();

  return (
    <View style={styles.item}>
      <View style={[styles.iconWrap, { backgroundColor: theme.successSubtle }]}>
        <Icon name="check" size={14} color={theme.onSuccessSubtle} />
      </View>
      <View style={styles.textWrap}>
        <ThemedText type="small">{getAlertBody(alert)}</ThemedText>
      </View>
      <ThemedText type="caption" themeColor="textSecondary">
        {formatRelativeTime(alert.resolvedAt ?? alert.createdAt)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: Space.sm,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
});
