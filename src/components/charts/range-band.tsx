import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { BaselineMetric } from '@/types/analytics';

type RangeBandProps = {
  label: string;
  metric: BaselineMetric;
  format?: (value: number) => string;
};

/**
 * "Normal for this animal" as a picture.
 *
 * The band is p10-p90, the tick is the median, the dot is today. A dot outside the
 * band is the entire feature — the farmer never has to read a number to see that
 * something has changed.
 */
export function RangeBand({ label, metric, format = (v) => String(Math.round(v)) }: RangeBandProps) {
  const theme = useTheme();

  const { p10, p90, p50, today, status } = metric;
  const hasBand = p10 !== null && p90 !== null && p90 > p10;

  // Widen the axis so a today-value outside the band still lands on screen.
  const lo = hasBand ? Math.min(p10!, today ?? p10!) : 0;
  const hi = hasBand ? Math.max(p90!, today ?? p90!) : 1;
  const span = hi - lo || 1;
  const ratio = (v: number) => Math.max(0, Math.min(100, ((v - lo) / span) * 100));
  const pct = (v: number): `${number}%` => `${ratio(v)}%`;

  const dotColor =
    status === 'high' ? theme.warning : status === 'low' ? theme.danger : theme.brand;

  return (
    <View style={styles.row}>
      <ThemedText type="small" style={styles.label} numberOfLines={1}>
        {label}
      </ThemedText>

      <View style={styles.trackWrap}>
        <View style={[styles.track, { backgroundColor: theme.surfaceSunken }]}>
          {hasBand ? (
            <View
              style={[
                styles.band,
                {
                  left: pct(p10!),
                  right: `${100 - ratio(p90!)}%` as `${number}%`,
                  backgroundColor: theme.brandSubtle,
                  borderColor: theme.brand,
                },
              ]}
            />
          ) : null}
          {p50 !== null && hasBand ? (
            <View style={[styles.median, { left: pct(p50), backgroundColor: theme.brand }]} />
          ) : null}
          {today !== null ? (
            <View style={[styles.dot, { left: pct(today), backgroundColor: dotColor }]} />
          ) : null}
        </View>
      </View>

      <ThemedText type="caption" style={[styles.value, { color: dotColor }]} numberOfLines={1}>
        {today !== null ? format(today) : '—'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  label: {
    width: 84,
  },
  trackWrap: {
    flex: 1,
  },
  track: {
    height: 10,
    borderRadius: Radius.full,
    justifyContent: 'center',
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  median: {
    position: 'absolute',
    width: 2,
    top: -2,
    bottom: -2,
    marginLeft: -1,
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    marginLeft: -6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  value: {
    width: 58,
    textAlign: 'right',
  },
});
