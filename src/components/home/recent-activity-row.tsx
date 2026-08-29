import { ScrollView, StyleSheet, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Space } from '@/constants/theme';
import type { Animal } from '@/types/animal';

type RecentActivityRowProps = {
  animals: Animal[];
  onSeeMore: () => void;
};

export default function RecentActivityRow({ animals, onSeeMore }: RecentActivityRowProps) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {animals.map((animal) => (
          <Card key={animal.id} variant="elevated" padding="md" radius="xl" style={styles.card}>
            <Avatar name={animal.name} photoUrl={animal.photoUrl} size={56} />
            <ThemedText type="caption" style={styles.name} numberOfLines={1}>
              {animal.name}
            </ThemedText>
          </Card>
        ))}
        <Card variant="outlined" padding="md" radius="xl" onPress={onSeeMore} style={styles.moreCard}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            More
          </ThemedText>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: Space.md,
    gap: Space.md,
  },
  card: {
    width: 96,
    alignItems: 'center',
    gap: Space.sm,
  },
  name: {
    textAlign: 'center',
  },
  moreCard: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
