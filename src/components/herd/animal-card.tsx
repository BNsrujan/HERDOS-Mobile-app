import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import StatusBadge from '@/components/herd/status-badge';
import type { Animal } from '@/types/animal';

type AnimalCardProps = {
  animal: Animal;
};

export default function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">{animal.name}</ThemedText>
      <StatusBadge status={animal.status} />
      <ThemedText type="small">Last seen: {animal.lastSeen}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
});
