import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'herdos:authToken';
const LOGGED_IN_KEY = 'herdos:loggedIn';

export function resolveBaseUrl() {
  return process.env.EXPO_PUBLIC_API_URL ?? 'https://api.herdos.app';
}

export function getAuthToken() {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `API request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Called when the API rejects our token. The root layout registers a handler that
 * sends the user back to login; without this an expired JWT leaves the app stuck
 * on permanently-failing screens with no way out.
 */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export async function clearSession() {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, LOGGED_IN_KEY]);
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = await getAuthToken();
  const response = await fetch(`${resolveBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401) {
    await clearSession();
    onUnauthorized?.();
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  if (!response.ok) {
    // Surface the server's own message (e.g. "That collar ID is already registered")
    // so forms can show something actionable instead of a status code.
    let message: string | undefined;
    try {
      const body = (await response.json()) as { error?: unknown };
      if (typeof body?.error === 'string') {
        message = body.error;
      }
    } catch {
      // Non-JSON error body; fall back to the default message.
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string) {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPut<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

export function apiPatch<T>(path: string, body: unknown) {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
}
