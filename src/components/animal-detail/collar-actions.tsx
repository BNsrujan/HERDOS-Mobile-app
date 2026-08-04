import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type CollarActionsProps = {
  onLocatePress: () => void;
  onViewMap: () => void;
  onShutdownPress: () => void;
};

export default function CollarActions({ onLocatePress, onViewMap, onShutdownPress }: CollarActionsProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onLocatePress} style={[styles.button, styles.primaryButton]}>
        <ThemedText type="smallBold" style={styles.buttonText}>🔊 Locate by Sound and light</ThemedText>
      </Pressable>
      <Pressable onPress={onViewMap} style={[styles.button, styles.mapButton]}>
        <ThemedText type="smallBold" style={styles.mapButtonText}>🗺️ View on Map</ThemedText>
      </Pressable>
      <Pressable onPress={onShutdownPress} style={[styles.button, styles.secondaryButton]}>
        <ThemedText type="smallBold" style={styles.secondaryButtonText}>⏻ Shutdown Collar</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#111827',
  },
  mapButton: {
    backgroundColor: '#E0F2FE',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#dc2626',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#dc2626',
  },
  mapButtonText: {
    color: '#0F766E',
  },
});
