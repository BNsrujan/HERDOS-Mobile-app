import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import { ThemedText } from '@/components/themed-text';
import { MapStatusColors } from '@/constants/theme';
import type { Animal } from '@/types/animal';

type AllAnimalsSheetProps = {
  animals: Animal[];
  onSelect: (animal: Animal) => void;
};

export default function AllAnimalsSheet({ animals, onSelect }: AllAnimalsSheetProps) {
  const snapPoints = useMemo(() => ['12%', '50%'], []);

  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <ThemedText type="subtitle">All Animals</ThemedText>
      </View>
      <FlatList
        data={animals}
        keyExtractor={(item: Animal) => item.id}
        horizontal
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Animal }) => (
          <Pressable onPress={() => onSelect(item)} style={styles.item}>
            <View style={[styles.avatarRing, { borderColor: MapStatusColors[item.status] }]}> 
              <Avatar name={item.name} photoUrl={item.photoUrl} size={56} />
            </View>
            <ThemedText type="small" style={styles.name}>{item.name}</ThemedText>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 4,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  item: {
    alignItems: 'center',
    width: 92,
    gap: 8,
  },
  avatarRing: {
    borderWidth: 3,
    borderRadius: 999,
    padding: 2,
  },
  name: {
    textAlign: 'center',
  },
});
