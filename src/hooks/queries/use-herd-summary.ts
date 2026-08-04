import { useQuery } from '@tanstack/react-query';

import { getAnimalSummary } from '@/services/api/animals';

export type HerdSummary = {
  healthy: number;
  watch: number;
  alert: number;
};

export function useHerdSummary() {
  return useQuery<HerdSummary, Error>({
    queryKey: ['herd-summary'],
    queryFn: getAnimalSummary,
    staleTime: 1000 * 60 * 5,
  });
}
