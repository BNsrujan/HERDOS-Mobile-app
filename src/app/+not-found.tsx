import { StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Page not found</ThemedText>
      <ThemedText type="small">The requested HerdOS page does not exist.</ThemedText>
      <Link href="/(tabs)">
        <ThemedText type="linkPrimary">Go to Home</ThemedText>
      </Link>
      <ThemedText type="small" onPress={() => router.replace('/(tabs)')}>
        Reload home
      </ThemedText>
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
