export interface ZoneSyncStatus {
  zoneId: string;
  geofenceVersion: number;
  total: number;
  /**
   * Transmitted by the base station. NOT confirmed by the collar — the RA protocol
   * has no collar-level ack, so the UI must say "Sent", never "Synced".
   */
  sent: number;
  pending: number;
  failed: number;
}

export interface RotationStep {
  id: string;
  zoneId: string;
  zoneName: string;
  position: number;
  dwellDays: number | null;
}

export interface RotationPlan {
  id: string;
  name: string;
  dwellDays: number;
  active: boolean;
  currentIndex: number;
  currentZoneId: string | null;
  currentZoneName: string | null;
  startedAt: string | null;
  dueAt: string | null;
  daysRemaining: number | null;
  steps: RotationStep[];
  sync: ZoneSyncStatus | null;
}
