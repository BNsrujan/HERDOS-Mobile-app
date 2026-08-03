import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AlertsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Alerts</ThemedText>
      <ThemedText type="small">Track notifications for animal health and fences.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
});
