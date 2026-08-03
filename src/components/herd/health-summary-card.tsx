import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type HealthSummaryCardProps = {
  total: number;
  healthy: number;
  watch: number;
  alerts: number;
};

export default function HealthSummaryCard({ total, healthy, watch, alerts }: HealthSummaryCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Herd Summary</ThemedText>
      <ThemedText type="small">Total: {total}</ThemedText>
      <ThemedText type="small">Healthy: {healthy}</ThemedText>
      <ThemedText type="small">Watch: {watch}</ThemedText>
      <ThemedText type="small">Alerts: {alerts}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
});
