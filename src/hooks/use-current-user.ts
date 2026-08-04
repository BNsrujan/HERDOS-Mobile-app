import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

import { apiGet } from '@/services/api/client';
import type { User } from '@/types/user';

const CURRENT_USER_QUERY_KEY = ['current-user'];

async function readStoredUserFallback(): Promise<User> {
  const [name, phone, location, avatarUrl] = await Promise.all([
    AsyncStorage.getItem('herdos:authName'),
    AsyncStorage.getItem('herdos:authPhone'),
    AsyncStorage.getItem('herdos:location'),
    AsyncStorage.getItem('herdos:avatarUrl'),
  ]);

  const resolvedName = name?.trim() || 'Herdos User';
  const resolvedPhone = phone ?? '';

  return {
    userName: resolvedName,
    phoneNO: resolvedPhone,
    phone: resolvedPhone,
    name: resolvedName,
    location: location ?? undefined,
    avatarUrl: avatarUrl ?? undefined,
  };
}

async function getCurrentUser(): Promise<User> {
  const token = await AsyncStorage.getItem('herdos:authToken');

  if (!token) {
    return readStoredUserFallback();
  }

  return apiGet<User>('/me');
}

export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
  });
}
