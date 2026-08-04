import { useQuery } from '@tanstack/react-query';

import { getAlerts } from '@/services/api/alerts';
import type { HerdAlert } from '@/types/alert';

export function useAlerts(params: { limit?: number; acknowledged?: boolean } = {}) {
  return useQuery<HerdAlert[], Error>({
    queryKey: ['alerts', params],
    queryFn: () => getAlerts(params),
    staleTime: 1000 * 60 * 5,
  });
}
