import { useQuery } from '@tanstack/react-query';

import { getAnimalPositions } from '@/services/api/animals';

export function useAnimalPositions() {
  return useQuery({
    queryKey: ['animal-positions'],
    queryFn: getAnimalPositions,
    refetchInterval: 15000,
  });
}
