import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusColors } from '@/constants/theme';

type HealthSummaryCardProps = {
  healthy: number;
  watch: number;
  alert: number;
};

export default function HealthSummaryCard({ healthy, watch, alert }: HealthSummaryCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Herd Health Today</ThemedText>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <View style={[styles.dot, { backgroundColor: StatusColors.healthy }]} />
          <ThemedText type="title">{healthy}</ThemedText>
          <ThemedText type="small">Healthy</ThemedText>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.dot, { backgroundColor: StatusColors.watch }]} />
          <ThemedText type="title">{watch}</ThemedText>
          <ThemedText type="small">Watch</ThemedText>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.dot, { backgroundColor: StatusColors.alert }]} />
          <ThemedText type="title">{alert}</ThemedText>
          <ThemedText type="small">Alert</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginBottom: 4,
  },
});
