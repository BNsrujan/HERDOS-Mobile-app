import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type FarmHeaderPillProps = {
  name: string;
  onlineCount: number;
  totalCount: number;
};

export default function FarmHeaderPill({ name, onlineCount, totalCount }: FarmHeaderPillProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <ThemedText type="smallBold">🏡</ThemedText>
      </View>
      <ThemedText type="smallBold" style={styles.name}>{name}</ThemedText>
      <View style={styles.dot} />
      <ThemedText type="small" style={styles.count}>{onlineCount}/{totalCount} online</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 2,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
  count: {
    color: '#4B5563',
  },
});
