import { Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';

let Marker: any;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Marker = require('react-native-maps').Marker;
}

type TrailEndpointMarkerProps = {
  lat: number;
  lng: number;
  kind: 'start' | 'end' | 'cursor';
};

const STYLES = {
  start: { color: '#22C55E', label: 'A', size: 26 },
  end: { color: '#EF4444', label: 'B', size: 26 },
  // The ghost dot that rides the path during playback.
  cursor: { color: '#FFFFFF', label: '', size: 18 },
} as const;

export default function TrailEndpointMarker({ lat, lng, kind }: TrailEndpointMarkerProps) {
  const spec = STYLES[kind];

  const pin = (
    <View
      style={[
        styles.pin,
        {
          width: spec.size,
          height: spec.size,
          backgroundColor: spec.color,
          borderWidth: kind === 'cursor' ? 3 : 2,
          borderColor: kind === 'cursor' ? '#111827' : '#FFFFFF',
        },
      ]}
    >
      {spec.label ? (
        <ThemedText type="caption" style={styles.label}>
          {spec.label}
        </ThemedText>
      ) : null}
    </View>
  );

  if (Platform.OS === 'web') return pin;

  return (
    <Marker
      coordinate={{ latitude: lat, longitude: lng }}
      anchor={{ x: 0.5, y: 0.5 }}
      // The cursor moves every frame during playback; re-rasterising it would
      // stutter, and the endpoints never change at all.
      tracksViewChanges={false}
      zIndex={kind === 'cursor' ? 4 : 3}
    >
      {pin}
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Fixed white: the pin fill is always a saturated marker colour.
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
