import { useQuery } from '@tanstack/react-query';

import { getWaterVisits } from '@/services/api/analytics';
import type { WaterVisits } from '@/types/analytics';

export function useWaterVisits(animalId: string | undefined, days = 7) {
  return useQuery<WaterVisits, Error>({
    queryKey: ['water-visits', animalId, days],
    queryFn: () => getWaterVisits(animalId!, days),
    enabled: Boolean(animalId),
    staleTime: 1000 * 60 * 5,
  });
}
