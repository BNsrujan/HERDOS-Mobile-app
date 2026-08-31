export type ActivityCode = 0 | 1 | 2 | 3;

export interface TrackPoint {
  lat: number;
  lng: number;
  /** ISO instant. */
  at: string;
  /** Null when the collar did not classify this sample. */
  activity: ActivityCode | null;
}

export interface AnimalTrack {
  animalId: string;
  animalName: string;
  from: string;
  to: string;
  timezone: string;
  points: TrackPoint[];
  distanceMeters: number;
  /** Points before simplification. */
  pointCount: number;
  /** True when the path was decimated to fit the request budget. */
  simplified: boolean;
  /** 0-100. Low values mean the trail has gaps, not that the animal stood still. */
  coveragePercent: number;
}

/** A run of consecutive points sharing one activity, drawn as one coloured line. */
export interface TrackSegment {
  activity: ActivityCode | null;
  points: TrackPoint[];
}
