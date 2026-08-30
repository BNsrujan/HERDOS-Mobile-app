import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Space } from '@/constants/theme';
import type { HomeRange, RestSpots } from '@/types/spatial';
import { formatDuration } from '@/utils/track-display';

type PlacesCardProps = {
  homeRange: HomeRange | undefined;
  restSpots: RestSpots | undefined;
  onPress: () => void;
};

/**
 * "Where it spends time" — the counterpart to the Movement card's "where it went".
 *
 * Deliberately pairs the full range with the core: a wide hull around a tiny core
 * means an animal that walks a lot but uses very little of the paddock, which reads
 * completely differently from an evenly-used range of the same area.
 */
export default function PlacesCard({ homeRange, restSpots, onPress }: PlacesCardProps) {
  const hasRange = Boolean(homeRange && homeRange.hull.length >= 3);
  const spots = restSpots?.spots ?? [];
  // A spot revisited across days is a habit; a one-off is just a nap.
  const habitual = spots.filter((s) => s.visitCount > 1);
  const longest = spots.length
    ? spots.reduce((best, s) => (s.durationMinutes > best.durationMinutes ? s : best))
    : null;

  return (
    <Card variant="elevated" radius="xl" onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="heading">Where it spends time</ThemedText>
        <Icon name="chevron-right" size={18} />
      </View>

      {hasRange ? (
        <View style={styles.statRow}>
          <Stat value={`${homeRange!.areaHectares} ha`} label="range used" />
          <Stat value={`${homeRange!.coreAreaHectares} ha`} label="core area" />
        </View>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          Not enough history yet to map a home range.
        </ThemedText>
      )}

      {spots.length ? (
        <View style={styles.restBlock}>
          <ThemedText type="small">
            {spots.length} rest {spots.length === 1 ? 'spot' : 'spots'} ·{' '}
            {formatDuration(restSpots!.totalRestMinutes)} resting
          </ThemedText>
          {longest ? (
            <ThemedText type="caption" themeColor="textSecondary">
              Longest stop {formatDuration(longest.durationMinutes)}
              {longest.nightRest ? ' overnight' : ''}
              {habitual.length ? ` · ${habitual.length} regular spot${habitual.length === 1 ? '' : 's'}` : ''}
            </ThemedText>
          ) : null}
        </View>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          No rest stops detected in the last week.
        </ThemedText>
      )}

      <ThemedText type="link">Show on map</ThemedText>
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="bodyBold">{value}</ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
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
  statRow: {
    flexDirection: 'row',
    gap: Space.xl,
  },
  stat: {
    flex: 1,
  },
  restBlock: {
    gap: Space.xs,
  },
});
