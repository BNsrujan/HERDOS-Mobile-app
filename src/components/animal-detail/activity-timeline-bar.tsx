import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { ActivitySegment } from '@/types/animal';

const segmentColors = {
  grazing: '#86EFAC',
  resting: '#D1D5DB',
  active: '#166534',
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
  const axisStart = 6;
  const axisEnd = 18;
  const totalHours = axisEnd - axisStart;

  return (
    <View style={styles.container}>
      <View style={styles.barTrack}>
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
        <ThemedText type="small">6AM</ThemedText>
        <ThemedText type="small">12PM</ThemedText>
        <ThemedText type="small">6PM</ThemedText>
      </View>
      <View style={styles.legendRow}>
        {Object.entries(segmentLabels).map(([key, label]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: segmentColors[key as keyof typeof segmentColors] }]} />
            <ThemedText type="small">{label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  barTrack: {
    height: 28,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    height: '100%',
    borderRadius: 999,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
