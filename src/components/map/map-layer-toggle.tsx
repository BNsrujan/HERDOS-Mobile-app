import { StyleSheet } from 'react-native';

import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';
import { Surface } from '@/components/ui/surface';
import { Elevation, Radius, Space } from '@/constants/theme';

/**
 * Analytical layers are mutually exclusive by design, not preference:
 * react-native-maps has no reliable cross-type z-ordering on Android, and stacking
 * a heatmap, a coverage grid, a trail and marker overlays renders unpredictably.
 * Fences, danger zones and the boundary stay visible across every layer.
 */
export type MapLayer = 'live' | 'trail' | 'graze' | 'range' | 'signal';

const LAYERS: ChipOption<MapLayer>[] = [
  { value: 'live', label: 'Live' },
  { value: 'trail', label: 'Trail' },
  { value: 'graze', label: 'Graze' },
  { value: 'range', label: 'Range' },
  { value: 'signal', label: 'Signal' },
];

type MapLayerToggleProps = {
  value: MapLayer;
  onChange: (layer: MapLayer) => void;
  /** Layers whose backing feature has not shipped yet. */
  disabled?: MapLayer[];
};

export default function MapLayerToggle({ value, onChange, disabled = [] }: MapLayerToggleProps) {
  const options = LAYERS.filter((layer) => !disabled.includes(layer.value));

  return (
    <Surface scheme="light" level="surface" style={styles.container}>
      <ChipGroup scrollable options={options} value={value} onChange={onChange} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Space.sm,
    paddingVertical: Space.xs,
    borderRadius: Radius.full,
    ...Elevation.raised,
  },
});
