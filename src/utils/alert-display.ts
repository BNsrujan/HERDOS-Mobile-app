import type { AlertType, HerdAlert } from '@/types/alert';

/**
 * The API sends `animalName` / `message` / `type` (see mapAlert in Herdos_backend/server.js).
 * The legacy `title` / `description` fields are kept as a fallback for cached payloads.
 */

const TYPE_PRESENTATION: Record<AlertType, { icon: string; color: string }> = {
  panic: { icon: '▲', color: '#EF4444' },
  temperature: { icon: '°', color: '#F97316' },
  tamper: { icon: '!', color: '#F59E0B' },
  geofence: { icon: '◌', color: '#3B82F6' },
  sound: { icon: '🔈', color: '#8B5CF6' },
};

export function getAlertType(alert: HerdAlert): AlertType {
  return alert.type ?? 'panic';
}

export function getAlertPresentation(alert: HerdAlert) {
  return TYPE_PRESENTATION[getAlertType(alert)] ?? TYPE_PRESENTATION.panic;
}

export function getAlertTitle(alert: HerdAlert) {
  return alert.animalName ?? alert.title ?? 'Alert';
}

export function getAlertBody(alert: HerdAlert) {
  return alert.message ?? alert.description ?? '';
}
