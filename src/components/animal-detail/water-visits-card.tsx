import { StyleSheet, View } from 'react-native';

import { Sparkline } from '@/components/charts/sparkline';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Space } from '@/constants/theme';
import type { WaterVisits } from '@/types/analytics';

type WaterVisitsCardProps = {
  data: WaterVisits;
  /** Farm-configured gap before a missed-drink alert; drives the badge tone. */
  gapHours?: number;
};

export default function WaterVisitsCard({ data, gapHours = 18 }: WaterVisitsCardProps) {
  const today = data.summary[data.summary.length - 1];
  const hours = data.hoursSinceLastVisit;

  const tone = hours === null ? 'neutral' : hours > gapHours ? 'danger' : hours > gapHours * 0.7 ? 'warning' : 'success';

  return (
    <Card variant="elevated" radius="xl" style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="heading">Water</ThemedText>
        <Badge
          label={hours === null ? 'never seen' : `${hours}h ago`}
          tone={tone}
        />
      </View>

      <ThemedText type="small">
        {today ? `${today.visitCount} visit${today.visitCount === 1 ? '' : 's'} today` : 'No visits today'}
        {data.visits[0] ? ` · ${data.visits[0].zoneName}` : ''}
      </ThemedText>

      {data.summary.length > 1 ? (
        <View style={styles.sparkBlock}>
          <Sparkline values={data.summary.map((d) => d.visitCount)} color="#3B82F6" />
          <ThemedText type="caption" themeColor="textSecondary">
            Visits over {data.days} days
          </ThemedText>
        </View>
      ) : null}

      {hours !== null && hours > gapHours ? (
        <ThemedText type="caption" themeColor="onDangerSubtle">
          Longer than the {gapHours}h threshold — check the trough.
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Space.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
  sparkBlock: { gap: Space.xs },
});
