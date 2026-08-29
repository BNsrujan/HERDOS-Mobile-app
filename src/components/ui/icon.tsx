import { SymbolView } from 'expo-symbols';
import { View, type ColorValue } from 'react-native';

import { useSurface } from '@/components/ui/surface';

export type IconName =
  | 'arrow-left'
  | 'close'
  | 'plus'
  | 'bell'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron'
  | 'crosshair'
  | 'refresh'
  | 'fence'
  | 'person'
  | 'speaker'
  | 'volume'
  | 'battery'
  | 'device'
  | 'info'
  | 'shield'
  | 'globe'
  | 'home'
  | 'herd'
  | 'map'
  | 'alerts'
  | 'settings'
  | 'search'
  | 'warning'
  | 'check'
  | 'edit'
  | 'power'
  | 'location'
  | 'sound';

type SymbolSpec = { ios: string; android: string; web: string };

const ICONS: Record<IconName, SymbolSpec> = {
  'arrow-left': { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  'chevron-right': { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  'chevron-down': { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  crosshair: { ios: 'location', android: 'my_location', web: 'my_location' },
  refresh: { ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' },
  fence: { ios: 'map', android: 'map', web: 'map' },
  person: { ios: 'person', android: 'person', web: 'person' },
  speaker: { ios: 'speaker.wave.2', android: 'volume_up', web: 'volume_up' },
  volume: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
  battery: { ios: 'battery.75', android: 'battery_full', web: 'battery_full' },
  device: { ios: 'antenna.radiowaves.left.and.right', android: 'wifi', web: 'wifi' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  shield: { ios: 'shield', android: 'shield', web: 'shield' },
  globe: { ios: 'globe', android: 'public', web: 'public' },
  home: { ios: 'house', android: 'home', web: 'home' },
  herd: { ios: 'person.3', android: 'groups', web: 'people' },
  map: { ios: 'map', android: 'map', web: 'map' },
  alerts: { ios: 'bell', android: 'notifications', web: 'notifications' },
  settings: { ios: 'gear', android: 'settings', web: 'settings' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  warning: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  power: { ios: 'power', android: 'power_settings_new', web: 'power_settings_new' },
  location: { ios: 'mappin', android: 'place', web: 'place' },
  sound: { ios: 'speaker.wave.3', android: 'volume_up', web: 'volume_up' },
};

export type IconProps = {
  name: IconName;
  color?: ColorValue;
  size?: number;
};

/**
 * Defaults to the enclosing Surface's foreground rather than a hardcoded dark grey,
 * so icons stay legible on inverse surfaces and in dark mode.
 */
export default function Icon({ name, color, size = 20 }: IconProps) {
  const surface = useSurface();

  return (
    <SymbolView
      name={ICONS[name] as any}
      tintColor={(color ?? surface.fg) as any}
      size={size}
      // Reserve the box so Android's async Material font load does not shift layout.
      fallback={<View style={{ width: size, height: size }} />}
    />
  );
}
