import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createZone } from '@/services/api/zones';

export function useCreateZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
