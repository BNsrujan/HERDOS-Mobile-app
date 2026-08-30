import { Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import type { RestSpot } from '@/types/spatial';

let Marker: any;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Marker = require('react-native-maps').Marker;
}

/** Night rest reads differently from a midday lie-down, so it gets its own colour. */
const NIGHT_COLOR = '#6366F1';
const DAY_COLOR = '#94A3B8';

type RestSpotMarkerProps = {
  spot: RestSpot;
  onPress?: () => void;
};

export default function RestSpotMarker({ spot, onPress }: RestSpotMarkerProps) {
  // Size carries duration: a 4-hour rest should read louder than a 20-minute one.
  const size = Math.round(Math.min(56, 22 + Math.sqrt(spot.durationMinutes) * 2.2));
  const color = spot.nightRest ? NIGHT_COLOR : DAY_COLOR;

  const pin = (
    <View style={[styles.halo, { width: size, height: size, borderColor: color }]}>
      <View style={[styles.core, { backgroundColor: color }]}>
        <ThemedText type="caption" style={styles.label}>
          {spot.visitCount > 1 ? `${spot.visitCount}×` : ''}
        </ThemedText>
      </View>
    </View>
  );

  if (Platform.OS === 'web') return pin;

  return (
    <Marker
      coordinate={{ latitude: spot.lat, longitude: spot.lng }}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
      tracksViewChanges={false}
      zIndex={2}
    >
      {pin}
    </Marker>
  );
}

const styles = StyleSheet.create({
  halo: {
    borderRadius: Radius.full,
    borderWidth: 2,
    backgroundColor: 'rgba(148,163,184,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Fixed white: the core is always a saturated marker colour.
  label: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
