import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

export type TabIconName = 'home' | 'herd' | 'map' | 'alerts' | 'settings';

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
  size: number;
};

const iconNameMap: Record<TabIconName, { ios: string; android: string; web: string }> = {
  home: { ios: 'house', android: 'home', web: 'home' },
  herd: { ios: 'person.3', android: 'groups', web: 'people' },
  map: { ios: 'map', android: 'map', web: 'map' },
  alerts: { ios: 'bell', android: 'notifications', web: 'notifications' },
  settings: { ios: 'gear', android: 'settings', web: 'settings' },
};

export default function TabIcon({ name, color, size }: TabIconProps) {
  // cast name map to any to satisfy stricter SymbolView typings
  return <SymbolView name={iconNameMap[name] as any} tintColor={color as any} size={size} />;
}
