import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HerdScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Herd</ThemedText>
      <ThemedText type="small">View livestock status and summaries.</ThemedText>
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
