import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resolveAlert } from '@/services/api/alerts';
import type { HerdAlert } from '@/types/alert';

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resolveAlert,
    onMutate: async (id: string) => {
      // Consumers key on ['alerts', params], so the exact key ['alerts'] holds nothing.
      // Match by prefix instead, and snapshot every matching cache entry for rollback.
      const filter = { queryKey: ['alerts'] as const };
      await queryClient.cancelQueries(filter);

      const previous = queryClient.getQueriesData<HerdAlert[]>(filter);

      queryClient.setQueriesData<HerdAlert[]>(filter, (current) =>
        (current ?? []).map((alert) =>
          alert.id === id
            ? { ...alert, acknowledged: true, resolvedAt: new Date().toISOString() }
            : alert,
        ),
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      // Resolving an alert also changes the home counters and the animal's history.
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['herd-summary'] });
      queryClient.invalidateQueries({ queryKey: ['animal-positions'] });
      queryClient.invalidateQueries({ queryKey: ['alert-history'] });
    },
  });
}
