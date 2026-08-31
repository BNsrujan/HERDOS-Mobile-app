import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Surface } from '@/components/ui/surface';
import { MAP_EDGE, MapZ } from '@/constants/map-layout';
import { Colors, Elevation, Radius, Space } from '@/constants/theme';

type DraftToolbarProps = {
  op: 'create' | 'edit';
  pointCount: number;
  canSave: boolean;
  saving: boolean;
  onUndo: () => void;
  onCancel: () => void;
  onSave: () => void;
};

/**
 * The bottom surface while drawing or reshaping a fence.
 *
 * Owns the bottom exclusively — the map sheet is UNMOUNTED in draft mode, not
 * collapsed. Previously the animals sheet was never gated on draft, so it sat over
 * these buttons and ate the bottom 168pt of the map the user has to tap to place
 * vertices.
 *
 * The primary action gets its own full-width row. With three flex:1 buttons sharing
 * one row they were 112pt each and "Undo last point" truncated; the fix is layout,
 * not a shorter label.
 */
export default function DraftToolbar({
  op,
  pointCount,
  canSave,
  saving,
  onUndo,
  onCancel,
  onSave,
}: DraftToolbarProps) {
  const hint =
    op === 'create'
      ? `${pointCount} ${pointCount === 1 ? 'point' : 'points'} · tap the map to add`
      : 'Drag a pin to move it · long-press an edge to add one';

  return (
    <Surface scheme="light" level="surface" style={styles.container}>
      <ThemedText type="caption" style={styles.hint} numberOfLines={1}>
        {hint}
      </ThemedText>

      <Button
        size="lg"
        fullWidth
        label={op === 'create' ? 'Name & save' : 'Save'}
        disabled={!canSave}
        loading={saving}
        onPress={onSave}
      />

      <View style={styles.secondaryRow}>
        {op === 'create' ? (
          <Button
            size="md"
            variant="secondary"
            label="Undo"
            iconLeft="undo"
            disabled={pointCount === 0}
            onPress={onUndo}
            style={styles.secondaryButton}
          />
        ) : null}
        <Button
          size="md"
          variant="secondary"
          label="Cancel"
          onPress={onCancel}
          style={styles.secondaryButton}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    // The tab bar is a flex sibling; bottom:0 is already above it.
    bottom: 0,
    paddingTop: Space.md,
    paddingHorizontal: MAP_EDGE,
    paddingBottom: MAP_EDGE,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    gap: Space.sm,
    zIndex: MapZ.draftToolbar,
    ...Elevation.raised,
  },
  hint: {
    color: Colors.light.textSecondary,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: Space.md,
  },
  secondaryButton: {
    flex: 1,
  },
});
