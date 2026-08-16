import { Platform, StyleSheet, Text, View } from 'react-native';

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
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.pin, { backgroundColor: MapStatusColors[position.status] }]}> 
        <Text style={styles.paw}>🐾</Text>
      </View>
    );
  }

  return (
    <Marker coordinate={{ latitude: position.lat, longitude: position.lng }} onPress={onPress}>
      <View style={[styles.pin, { backgroundColor: MapStatusColors[position.status] }]}> 
        <Text style={styles.paw}>🐾</Text>
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
  paw: {
    fontSize: 12,
  },
});
