import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toggleZone } from '@/services/api/zones';
import type { FenceZone } from '@/types/zone';

export function useToggleZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => toggleZone(id, active),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ['zones'] });

      const previousZones = queryClient.getQueryData<FenceZone[]>(['zones']);

      queryClient.setQueryData<FenceZone[]>(['zones'], (current) =>
        (current ?? []).map((zone) => (zone.id === id ? { ...zone, active } : zone)),
      );

      return { previousZones };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousZones) {
        queryClient.setQueryData(['zones'], context.previousZones);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
