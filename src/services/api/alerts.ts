import { apiGet, apiPatch } from './client';

import type { HerdAlert } from '@/types/alert';

export function getAlerts(params: { limit?: number; acknowledged?: boolean; animalId?: string; resolvedOnly?: boolean } = {}) {
  const query = new URLSearchParams();

  if (typeof params.limit === 'number') {
    query.append('limit', String(params.limit));
  }

  if (typeof params.acknowledged === 'boolean') {
    query.append('acknowledged', String(params.acknowledged));
  }

  if (params.animalId) {
    query.append('animalId', params.animalId);
  }

  if (typeof params.resolvedOnly === 'boolean') {
    query.append('resolvedOnly', String(params.resolvedOnly));
  }

  return apiGet<HerdAlert[]>(`/alerts${query.toString() ? `?${query.toString()}` : ''}`);
}

export function resolveAlert(id: string) {
  return apiPatch<HerdAlert>(`/alerts/${id}`, { acknowledged: true });
}

export function acknowledgeAlert(id: string) {
  return resolveAlert(id);
}
