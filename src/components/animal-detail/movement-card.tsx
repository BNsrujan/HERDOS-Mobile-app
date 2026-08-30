import { StyleSheet, View } from 'react-native';

import { Sparkline } from '@/components/charts/sparkline';
import MiniMap from '@/components/map/mini-map';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Space } from '@/constants/theme';
import type { DailyStat } from '@/types/analytics';
import type { TrackPoint } from '@/types/track';
import { ACTIVITY_COLORS, ACTIVITY_LABELS, formatDistance } from '@/utils/track-display';

type MovementCardProps = {
  distanceTodayMeters: number | null;
  todayPoints: TrackPoint[];
  series: DailyStat[];
  coveragePercent: number | null;
  onPress: () => void;
};

/** Activities worth showing in the trail legend. */
const LEGEND: (keyof typeof ACTIVITY_COLORS)[] = ['2', '1', '0', '3'];

export default function MovementCard({
  distanceTodayMeters,
  todayPoints,
  series,
  coveragePercent,
  onPress,
}: MovementCardProps) {
  // Compare today against the preceding days only; including today would drag the
  // baseline toward whatever today happens to be.
  const past = series.slice(0, -1).filter((d) => d.hasData);
  const average = past.length
    ? past.reduce((sum, d) => sum + d.distanceMeters, 0) / past.length
    : null;

  const delta =
    average && average > 0 && distanceTodayMeters !== null
      ? Math.round(((distanceTodayMeters - average) / average) * 100)
      : null;

  const lowCoverage = coveragePercent !== null && coveragePercent < 40;

  return (
    <Card variant="elevated" radius="xl" onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="heading">Moved today</ThemedText>
        <Icon name="chevron-right" size={18} />
      </View>

      <View style={styles.valueRow}>
        <ThemedText type="display">
          {distanceTodayMeters !== null ? formatDistance(distanceTodayMeters) : '—'}
        </ThemedText>
        {/* Only meaningful once there is a history to compare against. */}
        {delta !== null && past.length >= 3 ? (
          <Badge
            label={`${delta >= 0 ? '+' : ''}${delta}% vs usual`}
            tone={Math.abs(delta) > 40 ? 'warning' : 'neutral'}
          />
        ) : null}
      </View>

      {lowCoverage ? (
        <ThemedText type="caption" themeColor="onWarningSubtle">
          Patchy collar coverage today — this may undercount.
        </ThemedText>
      ) : null}

      {series.length > 1 ? (
        <View style={styles.sparkBlock}>
          <Sparkline
            values={series.map((d) => d.distanceMeters)}
            hasData={series.map((d) => d.hasData)}
          />
          <ThemedText type="caption" themeColor="textSecondary">
            Last {series.length} days
          </ThemedText>
        </View>
      ) : null}

      {todayPoints.length > 1 ? (
        <>
          <MiniMap points={todayPoints} />
          <View style={styles.legend}>
            {LEGEND.map((key) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: ACTIVITY_COLORS[key] }]} />
                <ThemedText type="caption" themeColor="textSecondary">
                  {ACTIVITY_LABELS[key]}
                </ThemedText>
              </View>
            ))}
          </View>
        </>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          No path recorded yet today.
        </ThemedText>
      )}

      <ThemedText type="link">View full trail</ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Space.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    flexWrap: 'wrap',
  },
  sparkBlock: {
    gap: Space.xs,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
