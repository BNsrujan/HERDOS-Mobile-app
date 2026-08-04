import { apiGet, apiPut } from './client';

export interface GeofencePoint {
  lat: number;
  lng: number;
}

export type Farm = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  onlineCount: number;
  totalCount: number;
  geofence: GeofencePoint[];
};

export function getFarm() {
  return apiGet<Farm>('/farm');
}

export function updateGeofence(points: GeofencePoint[]) {
  return apiPut<{ geofence: GeofencePoint[] }>('/farm/geofence', { points });
}
