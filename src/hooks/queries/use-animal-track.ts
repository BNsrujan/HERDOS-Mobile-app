import { useQuery } from '@tanstack/react-query';

import { getAnimalTrack, type TrackWindow } from '@/services/api/analytics';
import type { AnimalTrack } from '@/types/track';

export function useAnimalTrack(animalId: string | undefined, window: TrackWindow, enabled = true) {
  return useQuery<AnimalTrack, Error>({
    queryKey: ['animal-track', animalId, window],
    queryFn: () => getAnimalTrack(animalId!, window),
    enabled: Boolean(animalId) && enabled,
    // A rollup of the past, not live data.
    staleTime: 1000 * 60 * 5,
  });
}
