import { User } from '@/types/user';
import { apiGet, apiPost } from './client';

export type CheckPhoneResponse = {
  otpSent: boolean;
  /** Present only when the backend is in console-fallback mode (no SMS provider). */
  devMode?: boolean;
};

export async function checkPhone(payload: { name?: string; phone: string }) {
  return apiPost<CheckPhoneResponse>('/auth/check-phone', payload);
}

export async function verifyOtp(payload: { phone: string; otp: string; name?: string }) {
  return apiPost<{ verified: boolean; token?: string; user?: User }>('/auth/verify-otp', payload);
}

export async function getUserByPhone(phone: string) {
  return apiGet<User>(`/user?phone=${encodeURIComponent(phone)}`);
}



