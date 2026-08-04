import { useMutation } from '@tanstack/react-query';

import { locateAnimal } from '@/services/api/animals';

export function useLocateAnimal() {
  return useMutation({
    mutationFn: locateAnimal,
  });
}
