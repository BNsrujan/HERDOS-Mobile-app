import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Space } from '@/constants/theme';
import type { FixQuality } from '@/types/analytics';

const REASON_LABELS: Record<string, string> = {
  null_island: 'no GPS fix',
  out_of_range: 'impossible position',
  duplicate: 'repeated packet',
  speed_gate: 'implausible speed',
  teleport: 'position jump',
};

type FixQualityRowProps = {
  quality: FixQuality;
};

/**
 * The collar reports no HDOP or fix-validity field, so this reflects what the
 * backend inferred and discarded, not what the GPS itself claimed.
 */
export default function FixQualityRow({ quality }: FixQualityRowProps) {
  const rejectPercent = Math.round(quality.rejectRate * 100);
  const tone = rejectPercent >= 20 ? 'danger' : rejectPercent >= 5 ? 'warning' : 'success';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="small" themeColor="textSecondary">
          GPS quality
        </ThemedText>
        <Badge label={`${rejectPercent}% discarded`} tone={tone} />
      </View>

      <ThemedText type="caption" themeColor="textSecondary">
        {quality.okFixes.toLocaleString()} of {quality.totalFixes.toLocaleString()} fixes used
        {quality.medianIntervalSeconds !== null
          ? ` · every ${quality.medianIntervalSeconds}s`
          : ''}
      </ThemedText>

      {quality.byReason.length ? (
        <ThemedText type="caption" themeColor="textSecondary">
          Discarded: {quality.byReason
            .map((r) => `${r.count} ${REASON_LABELS[r.reason] ?? r.reason}`)
            .join(', ')}
        </ThemedText>
      ) : null}

      {quality.longestGapMinutes !== null && quality.longestGapMinutes > 30 ? (
        <ThemedText type="caption" themeColor="onWarningSubtle">
          Longest silence: {quality.longestGapMinutes} min
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
});
