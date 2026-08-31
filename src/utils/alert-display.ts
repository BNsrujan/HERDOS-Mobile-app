import type { LucideIcon } from 'lucide-react-native';
// Per-icon imports: the package barrel pulls in the whole ~1600-icon set.
import Activity from 'lucide-react-native/icons/activity';
import BatteryLow from 'lucide-react-native/icons/battery-low';
import Droplet from 'lucide-react-native/icons/droplet';
import Flag from 'lucide-react-native/icons/flag';
import MapPinned from 'lucide-react-native/icons/map-pinned';
import Radar from 'lucide-react-native/icons/radar';
import ShieldAlert from 'lucide-react-native/icons/shield-alert';
import Siren from 'lucide-react-native/icons/siren';
import Thermometer from 'lucide-react-native/icons/thermometer';
import UsersRound from 'lucide-react-native/icons/users-round';
import Volume2 from 'lucide-react-native/icons/volume-2';
import WifiOff from 'lucide-react-native/icons/wifi-off';

import type { AlertType, HerdAlert } from '@/types/alert';

/**
 * The API sends `animalName` / `message` / `type` (see mapAlert in Herdos_backend/server.js).
 * The legacy `title` / `description` fields are kept as a fallback for cached payloads.
 */

const TYPE_PRESENTATION: Record<AlertType, { Icon: LucideIcon; color: string }> = {
  panic: { Icon: Siren, color: '#EF4444' },
  temperature: { Icon: Thermometer, color: '#F97316' },
  tamper: { Icon: ShieldAlert, color: '#F59E0B' },
  geofence: { Icon: MapPinned, color: '#3B82F6' },
  sound: { Icon: Volume2, color: '#8B5CF6' },
  // Amber, not red: approaching a fence is a heads-up. The collar has NOT warned
  // the animal - only a real breach fires its deterrents.
  fence_approach: { Icon: Radar, color: '#F59E0B' },
  isolation: { Icon: UsersRound, color: '#F59E0B' },
  off_property: { Icon: Flag, color: '#DC2626' },
  collar_lost: { Icon: WifiOff, color: '#DC2626' },
  no_water: { Icon: Droplet, color: '#3B82F6' },
  behavior_anomaly: { Icon: Activity, color: '#8B5CF6' },
  low_battery: { Icon: BatteryLow, color: '#F59E0B' },
};

function getAlertType(alert: HerdAlert): AlertType {
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
