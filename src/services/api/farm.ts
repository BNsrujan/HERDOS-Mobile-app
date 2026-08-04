import { apiGet } from './client';

export type Farm = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  onlineCount: number;
  totalCount: number;
};

export function getFarm() {
  return apiGet<Farm>('/farm');
}
