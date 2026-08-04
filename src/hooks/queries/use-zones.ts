import { useQuery } from '@tanstack/react-query';

import { getZones } from '@/services/api/zones';
import type { FenceZone } from '@/types/zone';

export function useZones() {
  return useQuery<FenceZone[], Error>({
    queryKey: ['zones'],
    queryFn: getZones,
    staleTime: 1000 * 60 * 5,
  });
}
