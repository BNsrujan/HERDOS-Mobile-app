import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ActivitySegment } from '@/types/animal';

const segmentColors = {
  grazing: '#86EFAC',
  resting: '#9CA3AF',
  active: '#16A34A',
} as const;

const segmentLabels = {
  grazing: 'Grazing',
  resting: 'Resting',
  active: 'Active',
} as const;

type ActivityTimelineBarProps = {
  segments: ActivitySegment[];
};

export default function ActivityTimelineBar({ segments }: ActivityTimelineBarProps) {
  const theme = useTheme();
  const axisStart = 6;
  const axisEnd = 18;
  const totalHours = axisEnd - axisStart;

  return (
    <View style={styles.container}>
      <View style={[styles.barTrack, { backgroundColor: theme.surfaceSunken }]}>
        {segments.map((segment) => {
          const offset = ((segment.startHour - axisStart) / totalHours) * 100;
          const width = ((segment.endHour - segment.startHour) / totalHours) * 100;

          return (
            <View
              key={`${segment.startHour}-${segment.endHour}-${segment.type}`}
              style={[
                styles.segment,
                {
                  left: `${offset}%`,
                  width: `${Math.max(width, 8)}%`,
                  backgroundColor: segmentColors[segment.type],
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.axisRow}>
        <ThemedText type="caption" themeColor="textSecondary">6AM</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">12PM</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">6PM</ThemedText>
      </View>
      <View style={styles.legendRow}>
        {Object.entries(segmentLabels).map(([key, label]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: segmentColors[key as keyof typeof segmentColors] }]} />
            <ThemedText type="caption" themeColor="textSecondary">{label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space.sm,
  },
  barTrack: {
    height: 28,
    borderRadius: Radius.full,
    position: 'relative',
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    height: '100%',
    borderRadius: Radius.full,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Space.xs,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Space.md,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
});
