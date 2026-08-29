export type AnimalStatus = 'healthy' | 'watch' | 'alert' | 'lame' | 'milking' | 'pregnant';

export interface Animal {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  status: AnimalStatus;
  photoUrl?: string;
  collarId: string;
  lastSeenAt: string;
}

export interface AnimalPosition {
  animalId: string;
  lat: number;
  lng: number;
  status: AnimalStatus;
  updatedAt: string;
}

// The API returns null for any vital the collar has not reported yet
// (see mapAnimalDetail in Herdos_backend/server.js).
export interface AnimalDetail extends Animal {
  bodyTempC: number | null;
  activityPercent: number | null;
  ruminationHours: number | null;
  lastKnownLat: number | null;
  lastKnownLng: number | null;
}

export interface ActivitySegment {
  startHour: number;
  endHour: number;
  type: 'grazing' | 'resting' | 'active';
}
