import { useQuery } from '@tanstack/react-query';

import { getFarm } from '@/services/api/farm';

export function useFarm() {
  return useQuery({
    queryKey: ['farm'],
    queryFn: getFarm,
    staleTime: 1000 * 60 * 30,
  });
}
