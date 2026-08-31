import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon, { type IconName } from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { Surface } from '@/components/ui/surface';
import { MAP_EDGE } from '@/constants/map-layout';
import { SUPPORTS_HEATMAP, SUPPORTS_TERRAIN } from '@/constants/maps';
import { Colors, MinTouchTarget, Radius, Space } from '@/constants/theme';
import type { MapDataLayer, MapType } from '@/types/map';

export type LayersSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type LayersSheetProps = {
  layer: MapDataLayer;
  mapType: MapType;
  trailActive: boolean;
  onSelectLayer: (layer: MapDataLayer) => void;
  onSelectTrail: () => void;
  onSelectMapType: (type: MapType) => void;
  onDismiss?: () => void;
};

/** Terrain is Google-only; MKMapType has no equivalent, so Apple gets hybrid. */
const MAP_TYPES: { value: MapType; label: string; icon: IconName }[] = [
  { value: 'satellite', label: 'Satellite', icon: 'globe' },
  { value: 'standard', label: 'Standard', icon: 'map' },
  SUPPORTS_TERRAIN
    ? { value: 'terrain', label: 'Terrain', icon: 'route' }
    : { value: 'hybrid', label: 'Hybrid', icon: 'layers' },
];

type LayerRow = {
  value: MapDataLayer | 'trail';
  label: string;
  description: string;
  icon: IconName;
  unavailable?: string;
};

const LAYER_ROWS: LayerRow[] = [
  { value: 'live', label: 'Live positions', description: 'Where every animal is right now', icon: 'location' },
  { value: 'trail', label: 'Trail', description: "Replay one animal's path through the day", icon: 'route' },
  {
    value: 'graze',
    label: 'Grazing density',
    description: 'Which patches the herd feeds on most',
    icon: 'home',
    // Shown disabled rather than hidden, so the feature stays discoverable.
    unavailable: SUPPORTS_HEATMAP ? undefined : 'Not available on this map provider',
  },
  { value: 'range', label: 'Home range', description: 'The area an animal actually uses', icon: 'fence' },
  { value: 'signal', label: 'Signal coverage', description: 'Where collars reach the base station', icon: 'device' },
];

/**
 * Map type + data layer picker.
 *
 * Google puts layers behind a button rather than leaving a permanent rail on screen.
 * Doing the same here is what removes the rail's overlap with the bottom sheet, its
 * occlusion behind the trail console, and its horizontal overflow at five chips.
 */
const LayersSheet = forwardRef<LayersSheetHandle, LayersSheetProps>(function LayersSheet(
  { layer, mapType, trailActive, onSelectLayer, onSelectTrail, onSelectMapType, onDismiss },
  ref,
) {
  const sheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} opacity={0.5} pressBehavior="close" appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  const handleRow = (row: LayerRow) => {
    if (row.unavailable) return;
    if (row.value === 'trail') onSelectTrail();
    else onSelectLayer(row.value);
    sheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
    >
      <BottomSheetView>
        <Surface level="surface" style={styles.content}>
          <ThemedText type="overline" themeColor="textSecondary">
            Map type
          </ThemedText>
          <View style={styles.typeRow}>
            {MAP_TYPES.map((type) => {
              const selected = type.value === mapType;
              return (
                <AppPressable
                  key={type.value}
                  onPress={() => onSelectMapType(type.value)}
                  accessibilityLabel={type.label}
                  accessibilityState={{ selected }}
                  minTouchTarget={false}
                  style={[styles.typeTile, selected && styles.typeTileSelected]}
                >
                  <Icon name={type.icon} size={22} />
                  <ThemedText type="caption">{type.label}</ThemedText>
                </AppPressable>
              );
            })}
          </View>

          <ThemedText type="overline" themeColor="textSecondary" style={styles.sectionGap}>
            Show on map
          </ThemedText>
          {LAYER_ROWS.map((row) => {
            const selected = row.value === 'trail' ? trailActive : !trailActive && row.value === layer;
            const disabled = Boolean(row.unavailable);

            return (
              <AppPressable
                key={row.value}
                onPress={() => handleRow(row)}
                disabled={disabled}
                accessibilityLabel={row.label}
                accessibilityState={{ selected, disabled }}
                minTouchTarget={false}
                style={styles.layerRow}
              >
                <Icon name={row.icon} size={20} />
                <View style={styles.layerText}>
                  <ThemedText type="smallBold">{row.label}</ThemedText>
                  <ThemedText type="caption" themeColor="textSecondary">
                    {row.unavailable ?? row.description}
                  </ThemedText>
                </View>
                {selected ? <Icon name="check" size={18} /> : null}
              </AppPressable>
            );
          })}
        </Surface>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: MAP_EDGE,
    paddingBottom: Space['2xl'],
    gap: Space.sm,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Space.md,
  },
  typeTile: {
    flex: 1,
    height: 84,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.xs,
  },
  typeTileSelected: {
    borderColor: Colors.light.brand,
    backgroundColor: Colors.light.brandSubtle,
  },
  sectionGap: {
    marginTop: Space.md,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    minHeight: MinTouchTarget + 12,
  },
  layerText: {
    flex: 1,
    gap: 2,
  },
});

export default LayersSheet;
