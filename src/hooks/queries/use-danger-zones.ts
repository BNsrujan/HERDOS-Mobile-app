import { useQuery } from '@tanstack/react-query';

import { getDangerZones } from '@/services/api/zones';
import type { DangerZone } from '@/types/zone';

export function useDangerZones() {
  return useQuery<DangerZone[], Error>({
    queryKey: ['danger-zones'],
    queryFn: getDangerZones,
    staleTime: 1000 * 60 * 5,
  });
}
