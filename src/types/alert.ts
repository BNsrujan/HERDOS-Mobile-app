export type AlertSeverity = 'low' | 'medium' | 'high';

export type HerdAlert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  createdAt: string;
};
