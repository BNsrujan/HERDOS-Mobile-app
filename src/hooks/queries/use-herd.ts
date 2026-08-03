import { useQuery } from '@tanstack/react-query';

import { getHerd } from '@/services/api/animals';
import type { Animal } from '@/types/animal';

export function useHerd() {
  return useQuery<Animal[], Error>({
    queryKey: ['herd'],
    queryFn: getHerd,
    staleTime: 1000 * 60 * 5,
  });
}
