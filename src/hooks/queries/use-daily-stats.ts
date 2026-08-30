import { useQuery } from '@tanstack/react-query';

import { getDailyStats } from '@/services/api/analytics';
import type { DailyStats } from '@/types/analytics';

export function useDailyStats(animalId: string | undefined, days = 30) {
  return useQuery<DailyStats, Error>({
    queryKey: ['daily-stats', animalId, days],
    queryFn: () => getDailyStats(animalId!, days),
    enabled: Boolean(animalId),
    staleTime: 1000 * 60 * 5,
  });
}
