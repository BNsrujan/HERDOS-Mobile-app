import { useQuery } from '@tanstack/react-query';

import { getRotationPlans } from '@/services/api/rotation';
import type { RotationPlan } from '@/types/rotation';

export function useRotationPlans() {
  return useQuery<{ plans: RotationPlan[] }, Error, RotationPlan[]>({
    queryKey: ['rotation-plans'],
    queryFn: getRotationPlans,
    select: (data) => data.plans,
    staleTime: 1000 * 60,
  });
}
