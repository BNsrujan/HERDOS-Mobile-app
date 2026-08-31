/**
 * Map screen mode and layer types.
 *
 * The important shape here: `trail` is NOT a data layer. It is a mode that carries
 * its subject, so a trail with no animal is unrepresentable rather than merely
 * guarded against — and a trail cannot coexist with a zone draft, because both are
 * the same field.
 */

/** Overlays drawn on top of the base map. Deliberately excludes 'trail'. */
export type MapDataLayer = 'live' | 'graze' | 'range' | 'signal';

/** Base map imagery. 'terrain' is Google-only; Apple Maps offers 'hybrid' instead. */
export type MapType = 'satellite' | 'standard' | 'terrain' | 'hybrid';

export type MapMode =
  | { kind: 'browse' }
  | { kind: 'trail'; animalId: string }
  | { kind: 'draft'; op: 'create' }
  | { kind: 'draft'; op: 'edit'; zoneId: string };

/** The subset that lives in local state; draft is always derived from route params. */
export type LocalMapMode =
  | { kind: 'browse' }
  | { kind: 'trail'; animalId: string };

export type TrailRange = 'today' | 'yesterday' | '7d';

export const PLAYBACK_SPEEDS = [1, 2, 4, 8] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export function isDraftMode(mode: MapMode): mode is Extract<MapMode, { kind: 'draft' }> {
  return mode.kind === 'draft';
}

export function isTrailMode(mode: MapMode): mode is Extract<MapMode, { kind: 'trail' }> {
  return mode.kind === 'trail';
}
