import { useQuery } from '@tanstack/react-query';

import { getAnimal } from '@/services/api/animals';
import type { Animal } from '@/types/animal';

export function useAnimal(id?: string) {
  return useQuery<Animal, Error>({
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
