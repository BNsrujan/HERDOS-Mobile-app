import { useQuery } from '@tanstack/react-query';

import { getAlerts } from '@/services/api/alerts';
import type { HerdAlert } from '@/types/alert';

export function useAlerts() {
  return useQuery<HerdAlert[], Error>({
    queryKey: ['alerts'],
    queryFn: getAlerts,
    staleTime: 1000 * 60 * 5,
  });
}
