import { useQuery } from '@tanstack/react-query';

import { getRecentAnimals } from '@/services/api/animals';
import type { Animal } from '@/types/animal';

export function useRecentAnimals(limit = 3) {
  return useQuery<Animal[], Error>({
    queryKey: ['recent-animals', limit],
    queryFn: () => getRecentAnimals(limit),
    staleTime: 1000 * 60 * 5,
  });
}
