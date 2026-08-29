import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/herd/avatar';
import { ThemedText } from '@/components/themed-text';
import { AppPressable } from '@/components/ui/pressable';
import { Surface } from '@/components/ui/surface';
import { BottomTabInset, Colors, MapStatusColors, Radius, Space } from '@/constants/theme';
import type { Animal } from '@/types/animal';

type AllAnimalsSheetProps = {
  animals: Animal[];
  onSelect: (animal: Animal) => void;
};

/** Pinned light, like the other map overlays - it sits on satellite imagery. */
export default function AllAnimalsSheet({ animals, onSelect }: AllAnimalsSheetProps) {
  const insets = useSafeAreaInsets();

  if (!animals.length) {
    return null;
  }

  return (
    <Surface
      scheme="light"
      level="surface"
      style={[styles.sheet, { paddingBottom: insets.bottom }]}
    >
      <View style={styles.header}>
        <ThemedText type="smallBold" style={{ color: Colors.light.textPrimary }}>
          All Animals
        </ThemedText>
      </View>
      <FlatList
        data={animals}
        keyExtractor={(item: Animal) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Animal }) => (
          <AppPressable
            onPress={() => onSelect(item)}
            accessibilityLabel={`Locate ${item.name}`}
            minTouchTarget={false}
            style={styles.item}
          >
            <View style={[styles.avatarRing, { borderColor: MapStatusColors[item.status] }]}>
              <Avatar name={item.name} photoUrl={item.photoUrl} size={56} />
            </View>
            <ThemedText
              type="caption"
              style={[styles.name, { color: Colors.light.textPrimary }]}
              numberOfLines={1}
            >
              {item.name}
            </ThemedText>
          </AppPressable>
        )}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Space.md,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    zIndex: 4,
  },
  header: {
    paddingHorizontal: Space.lg,
    paddingBottom: Space.md,
  },
  list: {
    paddingHorizontal: Space.lg,
    gap: Space.md,
  },
  item: {
    alignItems: 'center',
    width: 80,
    gap: Space.sm,
  },
  avatarRing: {
    borderWidth: 3,
    borderRadius: Radius.full,
    padding: 2,
  },
  name: {
    textAlign: 'center',
  },
});
