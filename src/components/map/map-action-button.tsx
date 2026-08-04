import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export type IconSymbolName = 'crosshair' | 'refresh' | 'fence';

type MapActionButtonProps = {
  icon: IconSymbolName;
  onPress: () => void;
};

const iconMap: Record<IconSymbolName, string> = {
  crosshair: '⌖',
  refresh: '↻',
  fence: '▦',
};

export default function MapActionButton({ icon, onPress }: MapActionButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <ThemedText type="smallBold" style={styles.icon}>{iconMap[icon]}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
