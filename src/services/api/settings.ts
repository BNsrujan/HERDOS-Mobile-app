import type { User } from '@/types/user';
import type { CollarDiagnostic, Preferences } from '@/types/settings';

import { apiGet, apiPatch, getAuthToken, resolveBaseUrl } from './client';

export function getPreferences() {
  return apiGet<Preferences>('/me/preferences');
}

export function updatePreferences(patch: Partial<Preferences>) {
  return apiPatch<Preferences>('/me/preferences', patch);
}

export function updateProfile(patch: { name?: string; location?: string; avatarUrl?: string }) {
  return apiPatch<User>('/me', patch);
}

export async function uploadAvatar(uri: string) {
  const formData = new FormData();
  formData.append('avatar', {
    uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);

  const token = await getAuthToken();
  const response = await fetch(`${resolveBaseUrl()}/me/avatar`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      // Content-Type is deliberately omitted so fetch sets the multipart boundary.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Avatar upload failed with status ${response.status}`);
  }

  return (await response.json()) as { avatarUrl: string };
}

export function getBaseStationStatus() {
  return apiGet<{ connected: boolean }>('/device/base-station-status');
}

export function getDeviceDiagnostics() {
  return apiGet<{ collars: CollarDiagnostic[] }>('/device/diagnostics');
}
