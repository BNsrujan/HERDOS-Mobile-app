import { useQuery } from '@tanstack/react-query';

import { getRestSpots } from '@/services/api/analytics';
import type { RestSpots } from '@/types/spatial';

export function useRestSpots(animalId: string | undefined, days = 7, enabled = true) {
  return useQuery<RestSpots, Error>({
    queryKey: ['rest-spots', animalId, days],
    queryFn: () => getRestSpots(animalId!, days),
    enabled: Boolean(animalId) && enabled,
    staleTime: 1000 * 60 * 5,
  });
}
