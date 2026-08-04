import { useQuery } from '@tanstack/react-query';

import { getAnimal } from '@/services/api/animals';
import type { AnimalDetail } from '@/types/animal';

export function useAnimalDetail(id?: string) {
  return useQuery<AnimalDetail, Error>({
    queryKey: ['animal', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Missing animal id');
      }

      return getAnimal(id);
    },
    enabled: Boolean(id),
  });
}
