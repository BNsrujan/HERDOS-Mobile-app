import { Platform, StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import type { TrackPoint } from '@/types/track';
import { activityColor, toActivitySegments } from '@/utils/track-display';

let MapView: any;
let Polyline: any;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default || RNMaps;
  Polyline = RNMaps.Polyline;
}

type MiniMapProps = {
  points: TrackPoint[];
  height?: number;
};

/**
 * A small, non-interactive map preview of a path.
 *
 * All gestures are disabled: it is an illustration inside a card, and a scrollable
 * map nested in a ScrollView would fight the parent for touches.
 */
export default function MiniMap({ points, height = 140 }: MiniMapProps) {
  if (Platform.OS === 'web' || points.length < 2) {
    return <View style={[styles.placeholder, { height }]} />;
  }

  const segments = toActivitySegments(points);
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    // A floor keeps a nearly-stationary day from zooming to street level.
    latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.002),
    longitudeDelta: Math.max((maxLng - minLng) * 1.4, 0.002),
  };

  return (
    <View style={[styles.container, { height }]} pointerEvents="none">
      <MapView
        provider="google"
        style={StyleSheet.absoluteFill}
        mapType="satellite"
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        liteMode
      >
        {segments.map((segment, index) => (
          <Polyline
            key={index}
            coordinates={segment.points.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
            strokeColor={activityColor(segment.activity)}
            strokeWidth={3}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  placeholder: {
    borderRadius: Radius.md,
    backgroundColor: 'rgba(148,163,184,0.2)',
  },
});
