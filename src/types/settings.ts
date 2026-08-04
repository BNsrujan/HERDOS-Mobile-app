export interface Preferences {
  notifications: boolean;
  audioAlerts: boolean;
  alertVolume: number;
  collarBatteryAlerts: boolean;
  language: string;
}

export interface CollarDiagnostic {
  id: string;
  animalName: string;
  batteryPercent: number;
  signalStrength: number;
  lastSyncAt: string;
}
