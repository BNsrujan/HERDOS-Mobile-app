import type { DailyStats, FixQuality } from '@/types/analytics';
import type { AnimalTrack } from '@/types/track';

import { apiGet } from './client';

export type TrackWindow =
  | { date: string }
  | { from: string; to: string };

export function getAnimalTrack(
  animalId: string,
  window: TrackWindow,
  maxPoints?: number,
) {
  const query = new URLSearchParams();
  if ('date' in window) {
    query.set('date', window.date);
  } else {
    query.set('from', window.from);
    query.set('to', window.to);
  }
  if (maxPoints) query.set('maxPoints', String(maxPoints));

  return apiGet<AnimalTrack>(`/animals/${animalId}/track?${query.toString()}`);
}

export function getDailyStats(animalId: string, days = 30) {
  return apiGet<DailyStats>(`/animals/${animalId}/daily-stats?days=${days}`);
}

export function getFixQuality(animalId: string, days = 7) {
  return apiGet<FixQuality>(`/animals/${animalId}/fix-quality?days=${days}`);
}
