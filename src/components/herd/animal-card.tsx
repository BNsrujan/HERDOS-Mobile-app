import { StyleSheet, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import StatusBadge from '@/components/herd/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Space } from '@/constants/theme';
import type { Animal } from '@/types/animal';

type AnimalCardProps = {
  animal: Animal;
  onPress: () => void;
};

export default function AnimalCard({ animal, onPress }: AnimalCardProps) {
  return (
    <Card variant="elevated" onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Avatar photoUrl={animal.photoUrl} name={animal.name} size={52} />
        <View style={styles.details}>
          <ThemedText type="bodyBold" numberOfLines={1}>
            {animal.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {animal.breed}, {animal.ageYears} yrs
          </ThemedText>
        </View>
        <StatusBadge status={animal.status} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  details: {
    flex: 1,
    gap: Space.xs,
  },
});
