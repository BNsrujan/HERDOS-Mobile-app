import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

export type IconSymbolName = 'person' | 'bell' | 'speaker' | 'volume' | 'battery' | 'device' | 'info' | 'shield' | 'globe' | 'chevron';

type IconSymbolProps = {
  name: IconSymbolName;
  color?: ColorValue;
  size?: number;
};

const iconNameMap: Record<IconSymbolName, { ios: string; android: string; web: string }> = {
  person: { ios: 'person', android: 'person', web: 'person' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  speaker: { ios: 'speaker.wave.2', android: 'volume_up', web: 'volume_up' },
  volume: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
  battery: { ios: 'battery.75', android: 'battery_full', web: 'battery_full' },
  device: { ios: 'antenna.radiowaves.left.and.right', android: 'wifi', web: 'wifi' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  shield: { ios: 'shield', android: 'shield', web: 'shield' },
  globe: { ios: 'globe', android: 'public', web: 'public' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
};

export default function IconSymbol({ name, color = '#111827', size = 18 }: IconSymbolProps) {
  return <SymbolView name={iconNameMap[name] as any} tintColor={color as any} size={size} />;
}
