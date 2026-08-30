import { useQuery } from '@tanstack/react-query';

import { getGrazingHeatmap } from '@/services/api/analytics';
import type { GrazingHeatmap } from '@/types/spatial';

export function useGrazingHeatmap(
  params: { from?: string; to?: string; animalId?: string } = {},
  enabled = true,
) {
  return useQuery<GrazingHeatmap, Error>({
    queryKey: ['grazing-heatmap', params],
    queryFn: () => getGrazingHeatmap(params),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}
