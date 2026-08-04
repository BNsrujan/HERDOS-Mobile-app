import { useQuery } from '@tanstack/react-query';

import { getDeviceDiagnostics } from '@/services/api/settings';

export function useDeviceDiagnostics() {
  return useQuery<{ collars: { id: string; animalName: string; batteryPercent: number; signalStrength: number; lastSyncAt: string }[] }, Error>({
    queryKey: ['device-diagnostics'],
    queryFn: getDeviceDiagnostics,
  });
}
