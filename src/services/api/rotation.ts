import type { RotationPlan, ZoneSyncStatus } from '@/types/rotation';

import { apiGet, apiPost } from './client';

export function getRotationPlans() {
  return apiGet<{ plans: RotationPlan[] }>('/rotation-plans');
}

export function createRotationPlan(input: { name: string; dwellDays: number; zoneIds: string[] }) {
  return apiPost<RotationPlan>('/rotation-plans', input);
}

export function advanceRotation(planId: string) {
  return apiPost<{ fromZoneId: string; toZoneId: string; commandsQueued: number; downlinkError: string | null }>(
    `/rotation-plans/${planId}/advance`,
    {},
  );
}

export function pushZoneToCollars(zoneId: string) {
  return apiPost<{ queued: number; error: string | null; payloadLength: number }>(
    `/zones/${zoneId}/push-to-collars`,
    {},
  );
}

export function getZoneSyncStatus(zoneId: string) {
  return apiGet<ZoneSyncStatus>(`/zones/${zoneId}/sync-status`);
}
