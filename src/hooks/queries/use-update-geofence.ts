import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateGeofence } from '@/services/api/farm';

export function useUpdateGeofence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGeofence,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farm'] }),
  });
}
