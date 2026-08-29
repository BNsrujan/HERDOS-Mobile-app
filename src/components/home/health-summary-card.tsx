import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radius, Space, StatusColors } from '@/constants/theme';

type HealthSummaryCardProps = {
  healthy: number;
  watch: number;
  alert: number;
};

const STATS = [
  { key: 'healthy', label: 'Healthy', color: StatusColors.healthy },
  { key: 'watch', label: 'Watch', color: StatusColors.watch },
  { key: 'alert', label: 'Alert', color: StatusColors.alert },
] as const;

export default function HealthSummaryCard({ healthy, watch, alert }: HealthSummaryCardProps) {
  const values = { healthy, watch, alert };

  return (
    <Card variant="tinted" tone="brand" padding="xl" radius="xl" style={styles.container}>
      <ThemedText type="heading">Herd Health Today</ThemedText>
      <View style={styles.stats}>
        {STATS.map((stat) => (
          <View key={stat.key} style={[styles.statItem, { backgroundColor: stat.color }]}>
            <View style={[styles.dot , { backgroundColor: stat.color }]} />
            {/* Three columns share the row, so a 4-digit count must shrink to fit. */}
            <ThemedText type="display" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
              {values[stat.key]}
            </ThemedText>
            <ThemedText type="small">{stat.label}</ThemedText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space.lg,
  },
  stats: {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width: '100%',
    gap: Space.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: Space.xs,
    padding:4,
    borderRadius:8
  },

});
