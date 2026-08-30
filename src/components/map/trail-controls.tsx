import Slider from '@react-native-community/slider';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { Surface } from '@/components/ui/surface';
import { BottomTabInset, Colors, Elevation, MinTouchTarget, Radius, Space } from '@/constants/theme';
import type { AnimalTrack } from '@/types/track';
import {
  ACTIVITY_COLORS,
  ACTIVITY_LABELS,
  formatClock,
  formatDistance,
  formatDuration,
} from '@/utils/track-display';

export type TrailRange = 'today' | 'yesterday' | '7d';

const RANGES: ChipOption<TrailRange>[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: '7 days' },
];

const SPEEDS = [1, 2, 4, 8] as const;
export type PlaybackSpeed = (typeof SPEEDS)[number];

type TrailControlsProps = {
  track: AnimalTrack;
  range: TrailRange;
  onRangeChange: (range: TrailRange) => void;
  /** Index into track.points that the scrubber currently sits on. */
  cursor: number;
  onCursorChange: (index: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
  speed: PlaybackSpeed;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onClose: () => void;
};

/**
 * Playback console for the trail layer.
 *
 * Pinned to the light scheme like the other map overlays: it floats over satellite
 * imagery, which is dark in both themes.
 */
export default function TrailControls({
  track,
  range,
  onRangeChange,
  cursor,
  onCursorChange,
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
  onClose,
}: TrailControlsProps) {
  const insets = useSafeAreaInsets();
  const last = Math.max(0, track.points.length - 1);

  const startLabel = track.points.length ? formatClock(track.points[0].at, track.timezone) : '--:--';
  const endLabel = track.points.length ? formatClock(track.points[last].at, track.timezone) : '--:--';
  const cursorLabel = track.points[cursor]
    ? formatClock(track.points[cursor].at, track.timezone)
    : '--:--';

  const grazingMinutes = estimateActivityMinutes(track, 2);
  const activeActivity = track.points[cursor]?.activity ?? null;

  return (
    <Surface
      scheme="light"
      level="surface"
      style={[styles.container, { paddingBottom: insets.bottom + BottomTabInset + Space.sm }]}
    >
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
          {track.animalName}
        </ThemedText>
        <AppPressable onPress={onClose} accessibilityLabel="Close trail" style={styles.close}>
          <Icon name="close" size={18} color={Colors.light.textSecondary} />
        </AppPressable>
      </View>

      <View style={styles.statsRow}>
        <Stat value={formatDistance(track.distanceMeters)} label="travelled" />
        <Stat value={formatDuration(grazingMinutes)} label="grazing" />
        <Stat value={`${track.coveragePercent}%`} label="coverage" />
      </View>

      {/* A decimated path must never be presented as full precision. */}
      {track.simplified ? (
        <ThemedText type="caption" style={styles.note}>
          Showing {track.points.length} of {track.pointCount} points
        </ThemedText>
      ) : null}
      {track.coveragePercent < 40 ? (
        <ThemedText type="caption" style={styles.warning}>
          Patchy collar coverage — this path has gaps.
        </ThemedText>
      ) : null}

      <View style={styles.scrubberRow}>
        <ThemedText type="caption" style={styles.clock}>
          {startLabel}
        </ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={last}
          step={1}
          value={cursor}
          onValueChange={onCursorChange}
          disabled={track.points.length < 2}
          minimumTrackTintColor={Colors.light.brand}
          maximumTrackTintColor={Colors.light.border}
          accessibilityLabel="Scrub through the day"
        />
        <ThemedText type="caption" style={styles.clock}>
          {endLabel}
        </ThemedText>
      </View>

      <View style={styles.playRow}>
        <Button
          size="sm"
          variant={playing ? 'secondary' : 'primary'}
          label={playing ? 'Pause' : 'Play'}
          iconLeft={playing ? 'pause' : 'play'}
          onPress={onTogglePlay}
          disabled={track.points.length < 2}
        />

        <View style={styles.cursorBlock}>
          <ThemedText type="smallBold" style={styles.cursorTime}>
            {cursorLabel}
          </ThemedText>
          {activeActivity !== null ? (
            <View style={styles.activityRow}>
              <View
                style={[styles.activityDot, { backgroundColor: ACTIVITY_COLORS[String(activeActivity)] }]}
              />
              <ThemedText type="caption" style={styles.note}>
                {ACTIVITY_LABELS[String(activeActivity)]}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <AppPressable
          onPress={() => onSpeedChange(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
          accessibilityLabel={`Playback speed ${speed}x`}
          style={styles.speed}
        >
          <ThemedText type="smallBold" style={styles.speedText}>
            {speed}×
          </ThemedText>
        </AppPressable>
      </View>

      <ChipGroup options={RANGES} value={range} onChange={onRangeChange} />
    </Surface>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="smallBold" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={styles.note}>
        {label}
      </ThemedText>
    </View>
  );
}

/**
 * Approximate minutes spent in one activity from the returned points.
 *
 * The path is simplified, so this is an estimate for the summary strip only — the
 * authoritative per-activity totals come from the daily-stats rollup.
 */
function estimateActivityMinutes(track: AnimalTrack, activity: number) {
  let seconds = 0;
  for (let i = 1; i < track.points.length; i += 1) {
    if (track.points[i - 1].activity !== activity) continue;
    const gap =
      (new Date(track.points[i].at).getTime() - new Date(track.points[i - 1].at).getTime()) / 1000;
    // Cap each step so a coverage gap cannot inflate the total.
    seconds += Math.min(Math.max(gap, 0), 300);
  }
  return seconds / 60;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Space.md,
    paddingHorizontal: Space.lg,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    gap: Space.sm,
    zIndex: 5,
    ...Elevation.raised,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: Colors.light.textPrimary,
  },
  close: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -Space.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Space.lg,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    color: Colors.light.textPrimary,
  },
  note: {
    color: Colors.light.textSecondary,
  },
  warning: {
    color: Colors.light.onWarningSubtle,
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  slider: {
    flex: 1,
    height: 32,
  },
  clock: {
    color: Colors.light.textSecondary,
    width: 42,
    textAlign: 'center',
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  cursorBlock: {
    flex: 1,
  },
  cursorTime: {
    color: Colors.light.textPrimary,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  speed: {
    minWidth: MinTouchTarget,
    height: MinTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.light.surfaceSunken,
    paddingHorizontal: Space.sm,
  },
  speedText: {
    color: Colors.light.textPrimary,
  },
});
