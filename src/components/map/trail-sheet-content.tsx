import Slider from '@react-native-community/slider';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';
import LayerLegend from '@/components/map/layer-legend';
import { AppPressable } from '@/components/ui/pressable';
import { MAP_EDGE } from '@/constants/map-layout';
import { Colors, MinTouchTarget, Radius, Space } from '@/constants/theme';
import { PLAYBACK_SPEEDS, type PlaybackSpeed, type TrailRange } from '@/types/map';
import type { AnimalTrack } from '@/types/track';
import {
  ACTIVITY_COLORS,
  ACTIVITY_LABELS,
  formatClock,
  formatDistance,
  formatDuration,
} from '@/utils/track-display';

const RANGES: ChipOption<TrailRange>[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: '7 days' },
];

type TrailSheetContentProps = {
  track: AnimalTrack;
  range: TrailRange;
  onRangeChange: (range: TrailRange) => void;
  cursor: number;
  onCursorChange: (index: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
  speed: PlaybackSpeed;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  /** 0 = peek (playback only), 1+ = detail. */
  detent: number;
  onToggleDetent: () => void;
};

/**
 * Trail playback, as bottom-sheet content.
 *
 * Was a free-floating absolute overlay that occluded the layer rail entirely and
 * carried 92pt (iOS) / 112pt (Android) of padding for a tab bar it never overlapped.
 * As sheet content it has no position, no zIndex, no insets and no Surface of its
 * own — it inherits the sheet's pinned-light background, so `ThemedText` resolves
 * against a light foreground automatically.
 *
 * The peek detent shows only what fits in 176pt: title, scrubber, transport.
 */
export default function TrailSheetContent({
  track,
  range,
  onRangeChange,
  cursor,
  onCursorChange,
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
  detent,
  onToggleDetent,
}: TrailSheetContentProps) {
  const expanded = detent > 0;
  const last = Math.max(0, track.points.length - 1);
  const scrubbable = track.points.length >= 2;

  const startLabel = track.points.length ? formatClock(track.points[0].at, track.timezone) : '--:--';
  const endLabel = track.points.length ? formatClock(track.points[last].at, track.timezone) : '--:--';
  const cursorLabel = track.points[cursor]
    ? formatClock(track.points[cursor].at, track.timezone)
    : '--:--';

  const activeActivity = track.points[cursor]?.activity ?? null;

  return (
    <View style={styles.container}>
      <AppPressable
        onPress={onToggleDetent}
        accessibilityLabel={expanded ? 'Collapse trail details' : 'Expand trail details'}
        accessibilityState={{ expanded }}
        minTouchTarget={false}
        feedback="none"
        style={styles.headerRow}
      >
        <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
          {track.animalName}
        </ThemedText>
        <ThemedText type="caption" style={styles.muted}>
          {formatDistance(track.distanceMeters)}
        </ThemedText>
      </AppPressable>

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
          disabled={!scrubbable}
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
          disabled={!scrubbable}
        />

        <View style={styles.cursorBlock}>
          <ThemedText type="smallBold" style={styles.title}>
            {cursorLabel}
          </ThemedText>
          {activeActivity !== null ? (
            <View style={styles.activityRow}>
              <View
                style={[styles.activityDot, { backgroundColor: ACTIVITY_COLORS[String(activeActivity)] }]}
              />
              <ThemedText type="caption" style={styles.muted}>
                {ACTIVITY_LABELS[String(activeActivity)]}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <AppPressable
          onPress={() =>
            onSpeedChange(PLAYBACK_SPEEDS[(PLAYBACK_SPEEDS.indexOf(speed) + 1) % PLAYBACK_SPEEDS.length])
          }
          accessibilityLabel={`Playback speed ${speed}x`}
          style={styles.speed}
        >
          <ThemedText type="smallBold" style={styles.title}>
            {speed}×
          </ThemedText>
        </AppPressable>
      </View>

      {expanded ? (
        <View style={styles.detail}>
          <View style={styles.statsRow}>
            <Stat value={formatDistance(track.distanceMeters)} label="travelled" />
            <Stat value={formatDuration(estimateActivityMinutes(track, 2))} label="grazing" />
            <Stat value={`${track.coveragePercent}%`} label="coverage" />
          </View>

          {/* A decimated path must never be presented as full precision. */}
          {track.simplified ? (
            <ThemedText type="caption" style={styles.muted}>
              Showing {track.points.length} of {track.pointCount} points
            </ThemedText>
          ) : null}
          {track.coveragePercent < 40 ? (
            <ThemedText type="caption" style={styles.warning}>
              Patchy collar coverage — this path has gaps.
            </ThemedText>
          ) : null}

          <LayerLegend
            title="Activity"
            entries={(['2', '1', '0', '3'] as const).map((key) => ({
              color: ACTIVITY_COLORS[key],
              label: ACTIVITY_LABELS[key],
            }))}
          />

          <ChipGroup options={RANGES} value={range} onChange={onRangeChange} />
        </View>
      ) : null}
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="smallBold" style={styles.title}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={styles.muted}>
        {label}
      </ThemedText>
    </View>
  );
}

/**
 * Approximate minutes in one activity from the returned points.
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
    flex: 1,
    paddingHorizontal: MAP_EDGE,
    gap: Space.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
  // Pinned light: the sheet background is scheme="light" over satellite imagery.
  title: {
    flexShrink: 1,
    color: Colors.light.textPrimary,
  },
  muted: {
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
    width: 42,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  cursorBlock: {
    flex: 1,
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
  detail: {
    gap: Space.md,
    paddingTop: Space.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Space.lg,
  },
  stat: {
    flex: 1,
  },
});
