import { getUserByPhone } from '@/services/api/user';
import type { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export function useUserDetail({ phone }: { phone?: string }) {
    return useQuery<User, Error>({
        queryKey: ['user', phone],
        queryFn: () => {
            if (!phone) {
                throw new Error('Phone is required');
            }

            return getUserByPhone(phone);
        },
        enabled: Boolean(phone),
    });
}

export default useUserDetail;
