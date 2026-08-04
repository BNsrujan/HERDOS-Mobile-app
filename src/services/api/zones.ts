import { apiGet, apiPatch, apiPost } from './client';

import type { DangerZone, FenceZone, GeofencePoint } from '@/types/zone';

export function getZones() {
  return apiGet<FenceZone[]>('/zones');
}

export function createZone(input: { name: string; points: GeofencePoint[] }) {
  return apiPost<FenceZone>('/zones', input);
}

export function updateZoneShape(id: string, points: GeofencePoint[]) {
  return apiPatch<FenceZone>(`/zones/${id}`, { points });
}

export function toggleZone(id: string, active: boolean) {
  return apiPatch<FenceZone>(`/zones/${id}`, { active });
}

export function getDangerZones() {
  return apiGet<DangerZone[]>('/danger-zones');
}
