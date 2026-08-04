import type { HerdAlert } from '@/types/alert';

export function groupAlertsByDay(alerts: HerdAlert[]) {
  return alerts.reduce<Record<string, HerdAlert[]>>((groups, alert) => {
    const day = new Date(alert.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (!groups[day]) {
      groups[day] = [];
    }

    groups[day].push(alert);

    return groups;
  }, {});
}
