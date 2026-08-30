import { useQuery } from '@tanstack/react-query';

import { getHomeRange } from '@/services/api/analytics';
import type { HomeRange } from '@/types/spatial';

export function useHomeRange(animalId: string | undefined, window: '7d' | '30d' = '30d', enabled = true) {
  return useQuery<HomeRange, Error>({
    queryKey: ['home-range', animalId, window],
    queryFn: () => getHomeRange(animalId!, window),
    enabled: Boolean(animalId) && enabled,
    staleTime: 1000 * 60 * 10,
  });
}
