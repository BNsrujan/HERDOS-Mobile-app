/**
 * Map screen layer and playback types.
 *
 * `MapDataLayer` deliberately excludes 'trail': a trail needs a subject animal, so
 * the screen treats it as a mode rather than a layer value. See the `effectiveLayer`
 * derivation in app/(tabs)/map.tsx, which also stands the trail down during a zone
 * draft so the two can never fight for the same bottom surface.
 */

/** Overlays drawn on top of the base map. Deliberately excludes 'trail'. */
export type MapDataLayer = 'live' | 'graze' | 'range' | 'signal';

/** Base map imagery. 'terrain' is Google-only; Apple Maps offers 'hybrid' instead. */
export type MapType = 'satellite' | 'standard' | 'terrain' | 'hybrid';

export type TrailRange = 'today' | 'yesterday' | '7d';

export const PLAYBACK_SPEEDS = [1, 2, 4, 8] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

