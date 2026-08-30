export interface DailyStat {
  /** YYYY-MM-DD in farm-local time. */
  date: string;
  distanceMeters: number;
  restingMinutes: number;
  walkingMinutes: number;
  grazingMinutes: number;
  ruminatingMinutes: number;
  waterVisits: number;
  homeRangeHectares: number | null;
  fixCount: number;
  validFixCount: number;
  /** Null when no data exists for the day at all - distinct from 0% coverage. */
  coveragePercent: number | null;
  hasData: boolean;
}

export interface DailyStats {
  animalId: string;
  animalName: string;
  days: number;
  timezone: string;
  series: DailyStat[];
}

export type FixRejectReason =
  | 'null_island'
  | 'out_of_range'
  | 'duplicate'
  | 'speed_gate'
  | 'teleport';

export interface FixQuality {
  days: number;
  totalFixes: number;
  okFixes: number;
  /** 0-1. */
  rejectRate: number;
  byReason: { reason: FixRejectReason; count: number }[];
  medianIntervalSeconds: number | null;
  gapMinutesP95: number | null;
  longestGapMinutes: number | null;
}

export interface WaterVisit {
  id: string;
  zoneId: string;
  zoneName: string;
  enteredAt: string;
  exitedAt: string | null;
  durationMinutes: number;
}

export interface WaterVisits {
  days: number;
  timezone: string;
  lastVisitAt: string | null;
  hoursSinceLastVisit: number | null;
  visits: WaterVisit[];
  summary: { date: string; visitCount: number; totalMinutes: number }[];
}

export interface BaselineMetric {
  mean: number | null;
  stdDev: number | null;
  p10: number | null;
  p50: number | null;
  p90: number | null;
  today: number | null;
  zScore: number | null;
  status: 'low' | 'normal' | 'high';
}

export interface Baseline {
  windowDays: number;
  /** Usable days behind the numbers; below `ready` the UI must say "learning". */
  sampleDays: number;
  ready: boolean;
  computedAt: string;
  metrics: Record<string, BaselineMetric>;
}

export interface CohesionAnimal {
  animalId: string;
  animalName: string;
  lat: number;
  lng: number;
  distanceMeters: number;
}

export interface HerdCohesion {
  computedAt: string;
  centroid: { lat: number; lng: number } | null;
  medianDistanceMeters: number;
  spreadMeters: number;
  reportingCount: number;
  totalCount: number;
  /** False when too few collars are reporting for a centroid to mean anything. */
  reliable: boolean;
  animals?: CohesionAnimal[];
}
