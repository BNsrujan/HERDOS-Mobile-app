import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateZoneShape } from '@/services/api/zones';

export function useUpdateZoneShape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, points }: { id: string; points: { lat: number; lng: number }[] }) => updateZoneShape(id, points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
    },
  });
}
