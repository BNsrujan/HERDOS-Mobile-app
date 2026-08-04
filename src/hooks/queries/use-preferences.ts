import { useQuery } from '@tanstack/react-query';

import { getPreferences } from '@/services/api/settings';
import type { Preferences } from '@/types/settings';

export function usePreferences() {
  return useQuery<Preferences, Error>({
    queryKey: ['preferences'],
    queryFn: getPreferences,
  });
}
