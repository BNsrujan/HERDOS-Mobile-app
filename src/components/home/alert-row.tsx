import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { HerdAlert } from '@/types/alert';
import { formatRelativeTime } from '@/utils/format-time';

const alertStyles = {
  panic: { color: '#EF4444', icon: '▲' },
  temperature: { color: '#F97316', icon: '°' },
  tamper: { color: '#F97316', icon: '!' },
  geofence: { color: '#3B82F6', icon: '📍' },
  sound: { color: '#8B5CF6', icon: '🔈' },
} as const;

type AlertRowProps = {
  alert: HerdAlert;
  onPress: () => void;
};

export default function AlertRow({ alert }: AlertRowProps) {
  const style = alertStyles.panic;

  return (
    <View style={styles.container}>
      <View style={[styles.sideBar, { borderColor: style.color }]} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${style.color}22` }]}>
            <ThemedText type="smallBold" style={[styles.iconText, { color: style.color }]}>{style.icon}</ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.animalName}>{alert.title}</ThemedText>
          <ThemedText type="small" style={styles.timeText}>{formatRelativeTime(alert.createdAt)}</ThemedText>
        </View>
        <ThemedText type="small" style={[styles.message, { color: style.color }]}>{alert.description}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  sideBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  body: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontWeight: '700',
  },
  animalName: {
    flex: 1,
  },
  timeText: {
    color: '#6B7280',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});
