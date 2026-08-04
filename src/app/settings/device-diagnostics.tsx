import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDeviceDiagnostics } from '@/hooks/queries/use-device-diagnostics';

function formatRelativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function batteryColor(percent: number) {
  if (percent > 50) {
    return '#22C55E';
  }

  if (percent >= 20) {
    return '#F59E0B';
  }

  return '#EF4444';
}

export default function DeviceDiagnosticsScreen() {
  const { data } = useDeviceDiagnostics();
  const collars = useMemo(() => data?.collars ?? [], [data]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Device Diagnostics</ThemedText>

        {collars.map((collar) => (
          <ThemedView key={collar.id} style={styles.card}>
            <ThemedText type="smallBold">{collar.animalName}</ThemedText>
            <View style={styles.metricRow}>
              <ThemedText type="small">Battery</ThemedText>
              <ThemedText type="smallBold">{collar.batteryPercent}%</ThemedText>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, collar.batteryPercent))}%`, backgroundColor: batteryColor(collar.batteryPercent) }]} />
            </View>
            <View style={styles.metricRow}>
              <ThemedText type="small">Signal</ThemedText>
              <ThemedText type="smallBold">{collar.signalStrength} dBm</ThemedText>
            </View>
            <ThemedText type="small">Last sync: {formatRelativeTime(collar.lastSyncAt)}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 14,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
});
