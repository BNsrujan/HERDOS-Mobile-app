import { useQuery } from '@tanstack/react-query';

import { getBaseline } from '@/services/api/analytics';
import type { Baseline } from '@/types/analytics';

export function useBaseline(animalId: string | undefined) {
  return useQuery<Baseline, Error>({
    queryKey: ['baseline', animalId],
    queryFn: () => getBaseline(animalId!),
    enabled: Boolean(animalId),
    staleTime: 1000 * 60 * 30,
  });
}
