export type AlertSeverity = 'low' | 'medium' | 'high';

export type AlertType =
  | 'panic'
  | 'temperature'
  | 'tamper'
  | 'geofence'
  | 'sound'
  | 'fence_approach'
  | 'isolation'
  | 'off_property'
  | 'collar_lost'
  | 'no_water'
  | 'behavior_anomaly'
  | 'low_battery';

export type HerdAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  createdAt: string;
  animalId?: string;
  animalName?: string;
  type?: AlertType;
  message?: string;
  acknowledged?: boolean;
  resolvedAt?: string | null;
  zoneId?: string | null;
};
