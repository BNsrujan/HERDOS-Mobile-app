import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
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
          <View key={animal.id} style={styles.card}>
            <Avatar name={animal.name} photoUrl={animal.photoUrl} size={56} />
            <Text style={styles.name}>{animal.name}</Text>
          </View>
        ))}
        <TouchableOpacity onPress={onSeeMore} style={[styles.card, styles.moreCard]}>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 12,
    gap: 12,
  },
  card: {
    width: 96,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 13,
    color: '#111827',
    textAlign: 'center',
  },
  moreCard: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
  },
  moreText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
});
