import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import StatusBadge from '@/components/herd/status-badge';
import { ThemedText } from '@/components/themed-text';
import { AppPressable } from '@/components/ui/pressable';
import { MAP_EDGE } from '@/constants/map-layout';
import { Colors, MapStatusColors, Radius, Space } from '@/constants/theme';
import type { Animal } from '@/types/animal';
import { formatRelativeTime } from '@/utils/format-time';

type BrowseSheetContentProps = {
  animals: Animal[];
  /** 0 = peek (horizontal strip), 1+ = expanded (vertical list). */
  detent: number;
  selectedAnimalId: string | null;
  onSelect: (animal: Animal) => void;
  /** Tapping the header toggles detents, so gestures are never the only way. */
  onToggleDetent: () => void;
  onlineCount: number;
  totalCount: number;
  /** Compact legend shown in place of the title when a data layer is active. */
  legend?: React.ReactNode;
  /** Prompt shown when the user asked for a trail with no animal chosen. */
  prompt?: string;
};

export default function BrowseSheetContent({
  animals,
  detent,
  selectedAnimalId,
  onSelect,
  onToggleDetent,
  onlineCount,
  totalCount,
  legend,
  prompt,
}: BrowseSheetContentProps) {
  const expanded = detent > 0;

  return (
    <View style={styles.container}>
      <AppPressable
        onPress={onToggleDetent}
        accessibilityLabel={expanded ? 'Collapse animal list' : 'Expand animal list'}
        accessibilityState={{ expanded }}
        minTouchTarget={false}
        feedback="none"
        style={styles.header}
      >
        {legend ?? (
          <>
            <ThemedText type="smallBold" style={styles.title}>
              {prompt ?? 'All animals'}
            </ThemedText>
            {!prompt ? (
              <ThemedText type="caption" style={styles.subtitle}>
                {onlineCount} of {totalCount} online
              </ThemedText>
            ) : null}
          </>
        )}
      </AppPressable>

      {expanded ? (
        <BottomSheetFlatList
          data={animals}
          keyExtractor={(item: Animal) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: Animal }) => (
            <AppPressable
              onPress={() => onSelect(item)}
              accessibilityLabel={`Show ${item.name}`}
              minTouchTarget={false}
              style={[styles.row, item.id === selectedAnimalId && styles.rowSelected]}
            >
              <Avatar name={item.name} photoUrl={item.photoUrl} size={40} />
              <View style={styles.rowText}>
                <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
                  {item.name}
                </ThemedText>
                <ThemedText type="caption" style={styles.subtitle}>
                  {formatRelativeTime(item.lastSeenAt)}
                </ThemedText>
              </View>
              <StatusBadge status={item.status} />
            </AppPressable>
          )}
        />
      ) : (
        // Horizontal BottomSheetFlatList rather than a bare FlatList: it registers
        // with the sheet's gesture graph, so a sideways swipe on the strip does not
        // race the sheet's vertical pan.
        <BottomSheetFlatList
          data={animals}
          keyExtractor={(item: Animal) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContent}
          renderItem={({ item }: { item: Animal }) => (
            <AppPressable
              onPress={() => onSelect(item)}
              accessibilityLabel={`Show ${item.name}`}
              minTouchTarget={false}
              style={styles.stripItem}
            >
              <View
                style={[
                  styles.avatarRing,
                  {
                    borderColor:
                      item.id === selectedAnimalId
                        ? Colors.light.brand
                        : MapStatusColors[item.status],
                  },
                ]}
              >
                <Avatar name={item.name} photoUrl={item.photoUrl} size={56} />
              </View>
              <ThemedText type="caption" style={styles.stripName} numberOfLines={1}>
                {item.name}
              </ThemedText>
            </AppPressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: MAP_EDGE,
    paddingBottom: Space.sm,
    gap: 2,
  },
  // Pinned light: the sheet background is scheme="light" over satellite imagery.
  title: {
    color: Colors.light.textPrimary,
  },
  subtitle: {
    color: Colors.light.textSecondary,
  },
  stripContent: {
    paddingHorizontal: MAP_EDGE,
    gap: Space.md,
  },
  stripItem: {
    alignItems: 'center',
    width: 72,
    gap: Space.sm,
  },
  avatarRing: {
    borderWidth: 3,
    borderRadius: Radius.full,
    padding: 2,
  },
  stripName: {
    textAlign: 'center',
    color: Colors.light.textPrimary,
  },
  listContent: {
    paddingHorizontal: MAP_EDGE,
    paddingBottom: MAP_EDGE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.sm,
    minHeight: 60,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowSelected: {
    backgroundColor: Colors.light.surfaceSunken,
    borderRadius: Radius.md,
    paddingHorizontal: Space.sm,
    marginHorizontal: -Space.sm,
  },
});
