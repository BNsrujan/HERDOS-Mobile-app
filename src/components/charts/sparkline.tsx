import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SparklineProps = {
  values: number[];
  /** Days with no data render hollow rather than as a true zero. */
  hasData?: boolean[];
  height?: number;
  /** Highlights the final bar, which is normally "today". */
  highlightLast?: boolean;
  color?: string;
};

/**
 * View-based bar sparkline.
 *
 * Deliberately no SVG dependency: a fixed set of bars is trivially expressed as
 * flex children, matching the technique already used by
 * components/animal-detail/activity-timeline-bar.tsx. The richer chart set arrives
 * with react-native-svg in a later phase.
 */
export function Sparkline({
  values,
  hasData,
  height = 32,
  highlightLast = true,
  color,
}: SparklineProps) {
  const theme = useTheme();
  const max = Math.max(1, ...values);
  const barColor = color ?? theme.brand;

  return (
    <View style={[styles.row, { height }]}>
      {values.map((value, index) => {
        const isLast = index === values.length - 1;
        const missing = hasData ? !hasData[index] : false;
        const ratio = max > 0 ? value / max : 0;

        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                // A visible stub for zero keeps the baseline readable.
                height: Math.max(2, ratio * height),
                backgroundColor: missing ? 'transparent' : barColor,
                borderWidth: missing ? 1 : 0,
                borderColor: theme.border,
                opacity: missing ? 1 : highlightLast && isLast ? 1 : 0.45,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    flex: 1,
    borderRadius: Radius.xs,
    minWidth: 2,
  },
});
