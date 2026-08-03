import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnimal } from '@/hooks/queries/use-animal';

export default function AnimalDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useAnimal(id);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Loading animal…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Animal Details</ThemedText>
      <ThemedText type="small">ID: {id}</ThemedText>
      <ThemedText type="small">Name: {data?.name ?? 'Unknown'}</ThemedText>
      <ThemedText type="small">Status: {data?.status ?? 'Unknown'}</ThemedText>
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
