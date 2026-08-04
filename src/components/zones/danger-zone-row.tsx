import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { DangerZone } from '@/types/zone';

type DangerZoneRowProps = {
  zone: DangerZone;
  onPress: () => void;
};

export default function DangerZoneRow({ zone, onPress }: DangerZoneRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.border} />
      <View style={styles.iconWrap}>
        <ThemedText type="smallBold" style={styles.icon}>⚠</ThemedText>
      </View>
      <ThemedText type="smallBold">{zone.name}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  border: {
    width: 3,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#EF4444',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#DC2626',
  },
});
