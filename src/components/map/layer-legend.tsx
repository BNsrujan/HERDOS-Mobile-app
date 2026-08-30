import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Surface } from '@/components/ui/surface';
import { Colors, Elevation, Radius, Space } from '@/constants/theme';

type LegendEntry = { color: string; label: string };

type LayerLegendProps = {
  title: string;
  entries: LegendEntry[];
  /** Optional single-line summary, e.g. "12.4 ha · core 3.1 ha". */
  detail?: string;
};

/** Pinned-light legend card for the analytical map layers. */
export default function LayerLegend({ title, entries, detail }: LayerLegendProps) {
  return (
    <Surface scheme="light" level="surface" style={styles.container}>
      <ThemedText type="smallBold" style={styles.title}>
        {title}
      </ThemedText>
      {detail ? (
        <ThemedText type="caption" style={styles.detail}>
          {detail}
        </ThemedText>
      ) : null}
      <View style={styles.row}>
        {entries.map((entry) => (
          <View key={entry.label} style={styles.item}>
            <View style={[styles.swatch, { backgroundColor: entry.color }]} />
            <ThemedText type="caption" style={styles.detail}>
              {entry.label}
            </ThemedText>
          </View>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
    borderRadius: Radius.lg,
    gap: Space.xs,
    ...Elevation.raised,
  },
  title: {
    color: Colors.light.textPrimary,
  },
  detail: {
    color: Colors.light.textSecondary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
