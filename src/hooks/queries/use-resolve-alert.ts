import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resolveAlert } from '@/services/api/alerts';
import type { HerdAlert } from '@/types/alert';

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resolveAlert,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['alerts'] });

      const previousAlerts = queryClient.getQueryData<HerdAlert[]>(['alerts']);

      queryClient.setQueryData<HerdAlert[]>(['alerts'], (current) =>
        (current ?? []).map((alert) => (alert.id === id ? { ...alert, acknowledged: true, resolvedAt: new Date().toISOString() } : alert)),
      );

      return { previousAlerts };
    },
    onError: (_error, _id, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(['alerts'], context.previousAlerts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
