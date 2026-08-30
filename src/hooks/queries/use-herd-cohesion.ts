import { useQuery } from '@tanstack/react-query';

import { getHerdCohesion } from '@/services/api/analytics';
import type { HerdCohesion } from '@/types/analytics';

export function useHerdCohesion() {
  return useQuery<HerdCohesion, Error>({
    queryKey: ['herd-cohesion'],
    queryFn: getHerdCohesion,
    // Recomputed every 5 minutes server-side; matching that avoids stale spread.
    staleTime: 1000 * 60 * 2,
  });
}
