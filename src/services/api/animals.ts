import type { ActivitySegment, Animal, AnimalDetail, AnimalPosition, AnimalStatus } from '@/types/animal';
import { apiGet, apiPatch, apiPost } from './client';

export function getAnimals(params: { status?: AnimalStatus | 'all'; search?: string; sort?: 'recent'; limit?: number }) {
  const query = new URLSearchParams();

  if (params.status && params.status !== 'all') {
    query.append('status', params.status);
  }

  if (params.search) {
    query.append('search', params.search);
  }

  if (params.sort) {
    query.append('sort', params.sort);
  }

  if (typeof params.limit === 'number') {
    query.append('limit', `${params.limit}`);
  }

  return apiGet<Animal[]>(`/animals${query.toString() ? `?${query.toString()}` : ''}`);
}

export function getAnimalSummary() {
  return apiGet<{ healthy: number; watch: number; alert: number }>('/animals/summary');
}

export function getAnimal(id: string) {
  return apiGet<AnimalDetail>(`/animals/${id}`);
}

export function getActivityTimeline(animalId: string, date?: string) {
  const query = new URLSearchParams();

  if (date) {
    query.append('date', date);
  }

  return apiGet<{ segments: ActivitySegment[] }>(`/animals/${animalId}/activity-timeline${query.toString() ? `?${query.toString()}` : ''}`);
}

export function locateAnimal(animalId: string) {
  return apiPost<{ success: boolean }>(`/animals/${animalId}/locate`, {});
}

export function shutdownCollar(animalId: string) {
  return apiPost<{ success: boolean; error?: string }>(`/animals/${animalId}/shutdown-collar`, {}).then((payload) => {
    if (!payload.success) {
      throw new Error(payload.error || 'shutdown request failed');
    }
    return payload;
  });
}

export function getRecentAnimals(limit?: number) {
  return getAnimals({ sort: 'recent', limit });
}

export function getAnimalPositions() {
  return apiGet<AnimalPosition[]>('/animals/positions');
}

export function acknowledgeAnimal(id: string) {
  return apiPatch<Animal>(`/animals/${id}`, { acknowledged: true });
}
