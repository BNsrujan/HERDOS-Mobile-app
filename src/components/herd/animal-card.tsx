import { Pressable, StyleSheet, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import StatusBadge from '@/components/herd/status-badge';
import { ThemedText } from '@/components/themed-text';
import type { Animal } from '@/types/animal';

type AnimalCardProps = {
  animal: Animal;
  onPress: () => void;
};

export default function AnimalCard({ animal, onPress }: AnimalCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Avatar photoUrl={animal.photoUrl} name={animal.name} size={52} />
        <View style={styles.details}>
          <ThemedText type="subtitle">{animal.name}</ThemedText>
          <ThemedText type="small">{animal.breed}, {animal.ageYears} yrs</ThemedText>
        </View>
        <StatusBadge status={animal.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  details: {
    flex: 1,
    gap: 4,
  },
});
