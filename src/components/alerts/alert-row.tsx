import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { HerdAlert } from '@/types/alert';
import { formatRelativeTime } from '@/utils/format-time';

const typeStyles = {
  panic: { icon: '▲', color: '#EF4444' },
  temperature: { icon: '°', color: '#F97316' },
  tamper: { icon: '!', color: '#F59E0B' },
  geofence: { icon: '◌', color: '#3B82F6' },
  sound: { icon: '🔈', color: '#8B5CF6' },
} as const;

type AlertRowProps = {
  alert: HerdAlert;
  onResolve: () => void;
  isResolving?: boolean;
};

export default function AlertRow({ alert, onResolve, isResolving }: AlertRowProps) {
  const type = alert.type ?? 'panic';
  const style = typeStyles[type] ?? typeStyles.panic;
  const resolved = Boolean(alert.acknowledged);

  return (
    <View style={[styles.container, resolved && styles.resolvedContainer]}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${style.color}22` }]}> 
            <ThemedText type="smallBold" style={[styles.iconText, { color: style.color }]}> 
              {style.icon}
            </ThemedText>
          </View>
          <View style={styles.titleBlock}>
            <ThemedText type="smallBold">{alert.animalName ?? alert.title}</ThemedText>
            <ThemedText type="small" style={styles.metaText}>
              {alert.message ?? alert.description}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" style={styles.timeText}>
          {formatRelativeTime(alert.createdAt)}
        </ThemedText>
      </View>

      <View style={styles.footerRow}>
        <ThemedText type="small" style={styles.stateText}>
          {resolved ? 'Resolved' : 'Needs attention'}
        </ThemedText>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={resolved || isResolving}
          onPress={onResolve}
          style={[styles.resolveButton, (resolved || isResolving) && styles.resolveButtonDisabled]}
        >
          <ThemedText type="smallBold" style={styles.resolveButtonText}>
            {resolved ? 'Resolved' : isResolving ? 'Resolving…' : 'Resolve'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
    marginBottom: 10,
  },
  resolvedContainer: {
    backgroundColor: '#F9FAFB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  metaText: {
    color: '#6B7280',
  },
  timeText: {
    color: '#6B7280',
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  stateText: {
    color: '#4B5563',
    flex: 1,
  },
  resolveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  resolveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  resolveButtonText: {
    color: '#fff',
  },
});
