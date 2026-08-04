export type AlertSeverity = 'low' | 'medium' | 'high';

export type AlertType = 'panic' | 'temperature' | 'tamper' | 'geofence' | 'sound';

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
};
