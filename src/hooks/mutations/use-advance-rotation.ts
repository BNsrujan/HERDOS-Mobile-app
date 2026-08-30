import { useMutation, useQueryClient } from '@tanstack/react-query';

import { advanceRotation } from '@/services/api/rotation';

export function useAdvanceRotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => advanceRotation(planId),
    onSuccess: () => {
      // Advancing changes which zone is active, so the map and zone list are stale.
      queryClient.invalidateQueries({ queryKey: ['rotation-plans'] });
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
