import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { getAnimals } from '@/services/api/animals';
import type { Animal, AnimalStatus } from '@/types/animal';

export function useHerd(status: AnimalStatus | 'all', search: string) {
  const debouncedSearch = useDebouncedValue(search);

  return useQuery<Animal[], Error>({
    queryKey: ['herd', status, debouncedSearch],
    queryFn: () => getAnimals({ status, search: debouncedSearch }),
    staleTime: 1000 * 60 * 5,
  });
}
