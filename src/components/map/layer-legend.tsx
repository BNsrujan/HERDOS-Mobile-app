import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Space } from '@/constants/theme';

type LegendEntry = { color: string; label: string };

type LayerLegendProps = {
  title: string;
  entries: LegendEntry[];
  /** One-line summary, e.g. "12.4 ha used · 3.1 ha core". */
  detail?: string;
  /** Peek variant: title and swatches on one line, no detail row. */
  compact?: boolean;
};

/**
 * Legend for the active data layer.
 *
 * Renders INSIDE the bottom sheet, not as a floating card — it inherits the sheet's
 * pinned-light Surface, so it carries no background, no elevation and no positioning
 * of its own. As an overlay it used to be a 361x76 transparent view that blocked map
 * gestures whenever a data layer was on.
 */
export default function LayerLegend({ title, entries, detail, compact = false }: LayerLegendProps) {
  if (compact) {
    return (
      <View style={styles.compactRow}>
        <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        <View style={styles.swatches}>
          {entries.map((entry) => (
            <View key={entry.label} style={[styles.swatch, { backgroundColor: entry.color }]} />
          ))}
        </View>
        {detail ? (
          <ThemedText type="caption" style={styles.detail} numberOfLines={1}>
            {detail}
          </ThemedText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space.xs,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  // Pinned light: the enclosing sheet is scheme="light" over satellite imagery.
  title: {
    color: Colors.light.textPrimary,
  },
  detail: {
    flexShrink: 1,
    color: Colors.light.textSecondary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.md,
  },
  swatches: {
    flexDirection: 'row',
    gap: 3,
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
