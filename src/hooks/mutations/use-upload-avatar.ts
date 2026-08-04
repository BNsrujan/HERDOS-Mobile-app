import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadAvatar } from '@/services/api/settings';

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}
