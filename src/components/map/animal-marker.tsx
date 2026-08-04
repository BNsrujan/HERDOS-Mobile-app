import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { MapStatusColors } from '@/constants/theme';
import type { AnimalPosition } from '@/types/animal';

type AnimalMarkerProps = {
  position: AnimalPosition;
  onPress: () => void;
};

export default function AnimalMarker({ position, onPress }: AnimalMarkerProps) {
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
