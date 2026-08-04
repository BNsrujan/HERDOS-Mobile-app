export interface GeofencePoint {
  lat: number;
  lng: number;
}

export interface FenceZone {
  id: string;
  name: string;
  points: GeofencePoint[];
  active: boolean;
  animalCount: number;
}

export interface DangerZone {
  id: string;
  name: string;
  points: GeofencePoint[];
}
