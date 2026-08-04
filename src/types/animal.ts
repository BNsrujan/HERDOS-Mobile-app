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

export interface AnimalDetail extends Animal {
  bodyTempC: number;
  activityPercent: number;
  ruminationHours: number;
  lastKnownLat: number;
  lastKnownLng: number;
}

export interface ActivitySegment {
  startHour: number;
  endHour: number;
  type: 'grazing' | 'resting' | 'active';
}
