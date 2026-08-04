import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const formatCoordinate = (value: number) => `${value.toFixed(2)}°`;

type LocationCardProps = {
  lat: number;
  lng: number;
  onExpand: () => void;
};

export default function LocationCard({ lat, lng, onExpand }: LocationCardProps) {
  return (
    <Pressable onPress={onExpand} style={styles.card}>
      <View style={styles.overlay} />
      <View style={styles.marker} />
      <View style={styles.labelBox}>
        <ThemedText type="smallBold">Current Location</ThemedText>
        <ThemedText type="small" style={styles.coordText}>
          {formatCoordinate(lat)} N, {formatCoordinate(lng)} E
        </ThemedText>
      </View>
      <Pressable onPress={onExpand} style={styles.expandButton}>
        <ThemedText type="smallBold" style={styles.expandButtonText}>
          Expand
        </ThemedText>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#D1FAE5',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.16)',
  },
  marker: {
    position: 'absolute',
    top: 72,
    left: 92,
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: '#14B8A6',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  labelBox: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    gap: 2,
  },
  coordText: {
    color: '#4B5563',
  },
  expandButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(17,24,39,0.8)',
  },
  expandButtonText: {
    color: '#fff',
  },
});
