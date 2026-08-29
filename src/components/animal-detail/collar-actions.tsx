import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Space } from '@/constants/theme';

type CollarActionsProps = {
  onLocatePress: () => void;
  onViewMap: () => void;
  onShutdownPress: () => void;
};

export default function CollarActions({ onLocatePress, onViewMap, onShutdownPress }: CollarActionsProps) {
  return (
    <View style={styles.row}>
      <Button
        size="sm"
        label="Locate"
        iconLeft="sound"
        onPress={onLocatePress}
        accessibilityLabel="Locate by sound and light"
        style={styles.button}
      />
      <Button
        size="sm"
        variant="secondary"
        label="View on Map"
        iconLeft="map"
        onPress={onViewMap}
        style={styles.button}
      />
      <Button
        size="sm"
        variant="dangerOutline"
        label="Shutdown"
        iconLeft="power"
        onPress={onShutdownPress}
        accessibilityLabel="Shutdown collar"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Space.sm,
    marginBottom: Space.lg,
  },
  button: {
    flex: 1,
  },
});
