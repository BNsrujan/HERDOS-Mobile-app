import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { updatePreferences } from '@/services/api/settings';
import type { Preferences } from '@/types/settings';

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  const volumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useMutation({
    mutationFn: (patch: Partial<Preferences>) => updatePreferences(patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: ['preferences'] });
      const previous = queryClient.getQueryData<Preferences>(['preferences']);

      if (previous) {
        queryClient.setQueryData<Preferences>(['preferences'], {
          ...previous,
          ...patch,
        });
      }

      return { previous };
    },
    onError: (_error, _patch, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['preferences'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}
