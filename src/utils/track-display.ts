import type { ActivityCode, TrackPoint, TrackSegment } from '@/types/track';

/**
 * Trail colours by activity. Deliberately not the status palette: these describe
 * what the animal was doing, not whether it is healthy.
 */
export const ACTIVITY_COLORS: Record<string, string> = {
  0: '#94A3B8', // resting - slate
  1: '#F59E0B', // walking - amber
  2: '#22C55E', // grazing - green
  3: '#8B5CF6', // ruminating - violet
  unknown: '#64748B',
};

export const ACTIVITY_LABELS: Record<string, string> = {
  0: 'Resting',
  1: 'Walking',
  2: 'Grazing',
  3: 'Ruminating',
  unknown: 'Unknown',
};

export function activityColor(activity: ActivityCode | null) {
  return ACTIVITY_COLORS[activity === null ? 'unknown' : String(activity)];
}

/**
 * Split a path into runs of constant activity so each can be drawn as its own
 * coloured Polyline. Consecutive runs share a point, otherwise the line would
 * show a visible gap at every activity change.
 */
export function toActivitySegments(points: TrackPoint[]): TrackSegment[] {
  if (points.length < 2) {
    return points.length ? [{ activity: points[0].activity, points }] : [];
  }

  const segments: TrackSegment[] = [];
  // The line from points[i] to points[i+1] covers the period that BEGINS at
  // points[i], so the edge takes its colour from the first point, not the second.
  // Colouring by the second point shifts every colour one segment late and loses
  // the first activity entirely.
  let runActivity = points[0].activity;
  let current: TrackPoint[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    current.push(points[i]);

    const nextEdgeActivity = points[i].activity;
    const isLast = i === points.length - 1;

    if (!isLast && nextEdgeActivity !== runActivity) {
      segments.push({ activity: runActivity, points: current });
      // Repeat the boundary point so adjacent segments join without a visible gap.
      current = [points[i]];
      runActivity = nextEdgeActivity;
    }
  }

  if (current.length > 1) {
    segments.push({ activity: runActivity, points: current });
  }

  return segments;
}

/** Human-readable distance, switching to km past 1000 m. */
export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Clock label for the trail scrubber, in the farm's timezone. */
export function formatClock(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}
