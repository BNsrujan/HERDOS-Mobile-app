import { useQuery } from '@tanstack/react-query';

import { useFarm } from '@/hooks/queries/use-farm';
import { getWeather } from '@/services/weather';

export function useWeather() {
  const { data: farm } = useFarm();

  return useQuery({
    queryKey: ['weather', farm?.lat, farm?.lng],
    queryFn: () => getWeather(farm!.lat, farm!.lng),
    enabled: !!farm,
    staleTime: 1000 * 60 * 10,
  });
}
