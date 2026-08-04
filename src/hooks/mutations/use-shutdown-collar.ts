import { useMutation } from '@tanstack/react-query';

import { shutdownCollar } from '@/services/api/animals';

export function useShutdownCollar() {
  return useMutation({
    mutationFn: shutdownCollar,
  });
}
