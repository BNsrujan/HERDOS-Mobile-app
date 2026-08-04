import { useQuery } from '@tanstack/react-query';

import { getBaseStationStatus } from '@/services/api/settings';

export function useBaseStationStatus() {
  return useQuery<{ connected: boolean }, Error>({
    queryKey: ['base-station-status'],
    queryFn: getBaseStationStatus,
  });
}
