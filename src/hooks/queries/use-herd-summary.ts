import { useQuery } from '@tanstack/react-query';

import { getHerdSummary } from '@/services/api/animals';

export type HerdSummary = {
  total: number;
  healthy: number;
  watch: number;
  alerts: number;
};

export function useHerdSummary() {
  return useQuery<HerdSummary, Error>({
    queryKey: ['herd-summary'],
    queryFn: getHerdSummary,
    staleTime: 1000 * 60 * 5,
  });
}
