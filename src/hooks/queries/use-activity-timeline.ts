import { useQuery } from '@tanstack/react-query';

import { getActivityTimeline } from '@/services/api/animals';
import type { ActivitySegment } from '@/types/animal';

export function useActivityTimeline(animalId?: string, date?: string) {
  return useQuery<{ segments: ActivitySegment[] }, Error>({
    queryKey: ['activity-timeline', animalId, date],
    queryFn: () => {
      if (!animalId) {
        throw new Error('Missing animal id');
      }

      return getActivityTimeline(animalId, date);
    },
    enabled: Boolean(animalId),
  });
}
