import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Surface } from '@/components/ui/surface';
import { Colors, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const formatCoordinate = (value: number) => `${value.toFixed(2)}°`;

type LocationCardProps = {
  lat: number | null;
  lng: number | null;
  onExpand: () => void;
};

export default function LocationCard({ lat, lng, onExpand }: LocationCardProps) {
  const theme = useTheme();
  const hasFix = lat !== null && lng !== null;

  return (
    <View style={[styles.card, { backgroundColor: theme.brandSubtle }]}>
      <View style={styles.overlay} />
      {hasFix ? <View style={[styles.marker, { borderColor: Colors.light.surface }]} /> : null}

      {/* Pinned light: this label sits on a darkened map-preview overlay. */}
      <Surface scheme="light" level="surface" style={styles.labelBox}>
        <ThemedText type="smallBold" style={{ color: Colors.light.textPrimary }}>
          Current Location
        </ThemedText>
        <ThemedText type="small" style={{ color: Colors.light.textSecondary }}>
          {hasFix ? `${formatCoordinate(lat)} N, ${formatCoordinate(lng)} E` : 'No location reported yet'}
        </ThemedText>
      </Surface>

      {hasFix ? (
        <View style={styles.expandWrap}>
          <Button size="sm" label="Expand" onPress={onExpand} accessibilityLabel="Open on map" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 180,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Space.lg,
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
    borderRadius: Radius.full,
    backgroundColor: '#14B8A6',
    borderWidth: 3,
  },
  labelBox: {
    position: 'absolute',
    left: Space.lg,
    bottom: Space.lg,
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    borderRadius: Radius.md,
    gap: 2,
  },
  expandWrap: {
    position: 'absolute',
    right: Space.md,
    bottom: Space.md,
  },
});
