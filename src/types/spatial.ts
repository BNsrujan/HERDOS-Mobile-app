export interface RestSpot {
  id: string;
  lat: number;
  lng: number;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  nightRest: boolean;
  day: string;
  /** Distinct days in the window with a stay point within 30m - what makes it a *spot*. */
  visitCount: number;
}

export interface RestSpots {
  days: number;
  totalRestMinutes: number;
  spots: RestSpot[];
}

export interface HomeRange {
  window: string;
  hull: { lat: number; lng: number }[];
  areaHectares: number;
  centroid: { lat: number; lng: number } | null;
  /** The smallest set of cells holding half the fixes. */
  coreCells: { lat: number; lng: number; count: number }[];
  coreAreaHectares: number;
  fixCount: number;
  computedAt: string | null;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  minutes: number;
}

export interface GrazingHeatmap {
  from: string;
  to: string;
  cellMeters: number;
  /** Returned unnormalised so the same payload drives the gradient and a top-patches list. */
  maxWeight: number;
  totalCells: number;
  points: HeatmapPoint[];
}

export interface CoverageCell {
  lat: number;
  lng: number;
  avgRssi: number | null;
  minRssi: number | null;
  sampleCount: number;
}

export interface LoraCoverage {
  cellMeters: number;
  stationLat: number | null;
  stationLng: number | null;
  cells: CoverageCell[];
  /** Raw dBm plus thresholds; the client grades so a mis-scaled station is obvious. */
  gradeThresholds: { good: number; fair: number };
}
