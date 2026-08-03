import { apiFetch } from './client';

import type { Animal } from '@/types/animal';
import type { HerdSummary } from '@/hooks/queries/use-herd-summary';

export async function getHerd() {
  return apiFetch<Animal[]>('/herd');
}

export async function getAnimal(id: string) {
  return apiFetch<Animal>(`/animals/${id}`);
}

export async function getHerdSummary() {
  return apiFetch<HerdSummary>('/herd/summary');
}
