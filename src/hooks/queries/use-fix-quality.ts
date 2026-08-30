import { useQuery } from '@tanstack/react-query';

import { getFixQuality } from '@/services/api/analytics';
import type { FixQuality } from '@/types/analytics';

export function useFixQuality(animalId: string | undefined, days = 7) {
  return useQuery<FixQuality, Error>({
    queryKey: ['fix-quality', animalId, days],
    queryFn: () => getFixQuality(animalId!, days),
    enabled: Boolean(animalId),
    staleTime: 1000 * 60 * 5,
  });
}
