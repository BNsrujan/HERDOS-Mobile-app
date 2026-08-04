import { useQuery } from '@tanstack/react-query';

import { getAlerts } from '@/services/api/alerts';
import type { HerdAlert } from '@/types/alert';

export function useAnimalAlertHistory(animalId?: string) {
  return useQuery<HerdAlert[], Error>({
    queryKey: ['alert-history', animalId],
    queryFn: () => {
      if (!animalId) {
        throw new Error('Missing animal id');
      }

      return getAlerts({ animalId, resolvedOnly: true, limit: 5 });
    },
    enabled: Boolean(animalId),
  });
}
