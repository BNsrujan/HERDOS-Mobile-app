import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { HerdAlert } from '@/types/alert';
import { formatRelativeTime } from '@/utils/format-time';

export default function AlertHistoryItem({ alert }: { alert: HerdAlert }) {
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}>
        <ThemedText type="smallBold" style={styles.icon}>✓</ThemedText>
      </View>
      <View style={styles.textWrap}>
        <ThemedText type="small">{alert.message ?? alert.description}</ThemedText>
      </View>
      <ThemedText type="small" style={styles.timeText}>
        {formatRelativeTime(alert.resolvedAt ?? alert.createdAt)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#16A34A',
  },
  textWrap: {
    flex: 1,
  },
  timeText: {
    color: '#6B7280',
  },
});
