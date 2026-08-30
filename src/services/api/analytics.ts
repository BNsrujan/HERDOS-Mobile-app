import type { Baseline, DailyStats, FixQuality, HerdCohesion, WaterVisits } from '@/types/analytics';
import type { GrazingHeatmap, HomeRange, LoraCoverage, RestSpots } from '@/types/spatial';
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

export function getRestSpots(animalId: string, days = 7) {
  return apiGet<RestSpots>(`/animals/${animalId}/rest-spots?days=${days}`);
}

export function getHomeRange(animalId: string, window: '7d' | '30d' = '30d') {
  return apiGet<HomeRange>(`/animals/${animalId}/home-range?window=${window}`);
}

export function getGrazingHeatmap(params: { from?: string; to?: string; animalId?: string } = {}) {
  const query = new URLSearchParams();
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  if (params.animalId) query.set('animalId', params.animalId);
  return apiGet<GrazingHeatmap>(`/farm/grazing-heatmap?${query.toString()}`);
}

export function getLoraCoverage() {
  return apiGet<LoraCoverage>('/farm/lora-coverage');
}

export function getWaterVisits(animalId: string, days = 7) {
  return apiGet<WaterVisits>(`/animals/${animalId}/water-visits?days=${days}`);
}

export function getBaseline(animalId: string) {
  return apiGet<Baseline>(`/animals/${animalId}/baseline`);
}

export function getHerdCohesion() {
  return apiGet<HerdCohesion>('/farm/herd-cohesion');
}
