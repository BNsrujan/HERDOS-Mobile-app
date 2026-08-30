import { useQuery } from '@tanstack/react-query';

import { getLoraCoverage } from '@/services/api/analytics';
import type { LoraCoverage } from '@/types/spatial';

export function useLoraCoverage(enabled = true) {
  return useQuery<LoraCoverage, Error>({
    queryKey: ['lora-coverage'],
    queryFn: getLoraCoverage,
    enabled,
    staleTime: 1000 * 60 * 15,
  });
}
