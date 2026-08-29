import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAnimal, type CreateAnimalInput } from '@/services/api/animals';

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAnimalInput) => createAnimal(input),
    onSuccess: () => {
      // A new animal changes the herd list, the home counters and the map roster.
      queryClient.invalidateQueries({ queryKey: ['herd'] });
      queryClient.invalidateQueries({ queryKey: ['herd-summary'] });
      queryClient.invalidateQueries({ queryKey: ['recent-animals'] });
      queryClient.invalidateQueries({ queryKey: ['animal-positions'] });
    },
  });
}
