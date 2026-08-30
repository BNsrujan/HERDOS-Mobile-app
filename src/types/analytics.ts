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
