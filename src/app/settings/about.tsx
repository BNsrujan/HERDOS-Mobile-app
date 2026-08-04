import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">HERDOS</ThemedText>
        <ThemedText type="small">
          {/* TODO: Replace with the real app description copy. */}
          HERDOS helps farmers monitor livestock health, alerts, and device status in one place.
        </ThemedText>
        <ThemedText type="smallBold">Version: {Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 14,
  },
});
