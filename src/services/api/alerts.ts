import { apiFetch } from './client';

import type { HerdAlert } from '@/types/alert';

export async function getAlerts() {
  return apiFetch<HerdAlert[]>('/alerts');
}
