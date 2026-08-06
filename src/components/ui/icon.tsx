import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

type IconProps = {
  name: 'arrow-left' | 'close' | 'plus' | 'bell' | 'chevron-right' | 'crosshair' | 'refresh' | 'fence';
  color?: ColorValue;
  size?: number;
};

const map: Record<IconProps['name'], { ios: string; android: string; web: string }> = {
  'arrow-left': { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  'chevron-right': { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  crosshair: { ios: 'location', android: 'my_location', web: 'my_location' },
  refresh: { ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' },
  fence: { ios: 'map', android: 'map', web: 'map' },
};

export default function Icon({ name, color, size = 20 }: IconProps) {
  return <SymbolView name={map[name] as any} tintColor={color as any} size={size} />;
}
