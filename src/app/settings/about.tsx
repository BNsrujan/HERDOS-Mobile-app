import Constants from 'expo-constants';
import { StyleSheet, View, Image } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Image source={require('@/assets/images/logo-glow.png')} style={styles.logo} accessibilityLabel="HerdOS logo" />
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
  logo: {
    width: 160,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 4,
  },
});
