import PawPrint from 'lucide-react-native/icons/paw-print';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { MapStatusColors } from '@/constants/theme';
import type { AnimalPosition } from '@/types/animal';

let Marker: any;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Marker = require('react-native-maps').Marker;
}

type AnimalMarkerProps = {
  position: AnimalPosition;
  onPress: () => void;
};

export default function AnimalMarker({ position, onPress }: AnimalMarkerProps) {
  // The SVG paw paints a frame after mount, so the marker has to re-rasterize once
  // before it is frozen - snapshotting immediately yields an empty pin on Android.
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setTracksViewChanges(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.pin, { backgroundColor: MapStatusColors[position.status] }]}> 
        <PawPrint size={18} color="#FFFFFF" strokeWidth={2.25} />
      </View>
    );
  }

  return (
    <Marker
      coordinate={{ latitude: position.lat, longitude: position.lng }}
      onPress={onPress}
      // Leaving this true permanently re-rasterizes every frame and makes pins
      // flicker on Android, so it is flipped off once the icon has drawn.
      tracksViewChanges={tracksViewChanges}
    >
      <View style={[styles.pin, { backgroundColor: MapStatusColors[position.status] }]}> 
        <PawPrint size={18} color="#FFFFFF" strokeWidth={2.25} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
