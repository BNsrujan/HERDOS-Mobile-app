import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RangeBand } from '@/components/charts/range-band';
import { Sparkline } from '@/components/charts/sparkline';
import ScreenContainer from '@/components/layout/screen-container';
import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ChipGroup, type ChipOption } from '@/components/ui/chip-group';
import { QueryBoundary } from '@/components/ui/states';
import { Space } from '@/constants/theme';
import { useBaseline } from '@/hooks/queries/use-baseline';
import { useDailyStats } from '@/hooks/queries/use-daily-stats';
import { formatDistance, formatDuration } from '@/utils/track-display';

type Window = 7 | 14 | 30;

const WINDOWS: ChipOption<string>[] = [
  { value: '7', label: '7d' },
  { value: '14', label: '14d' },
  { value: '30', label: '30d' },
];

export default function TrendsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [days, setDays] = useState<Window>(14);

  const { data: stats, isLoading, isError, refetch } = useDailyStats(id, days);
  const { data: baseline } = useBaseline(id);

  return (
    <ScreenContainer
      scroll
      edges={['top', 'bottom']}
      contentContainerStyle={styles.content}
      header={<ScreenHeader title={stats?.animalName ? `${stats.animalName} · Trends` : 'Trends'} back />}
    >
      <ChipGroup options={WINDOWS} value={String(days)} onChange={(v) => setDays(Number(v) as Window)} />

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        error={{ description: 'Unable to load trends.' }}
      >
        {stats ? (
          <>
            <TrendCard
              title="Distance"
              series={stats.series.map((d) => d.distanceMeters)}
              hasData={stats.series.map((d) => d.hasData)}
              coverage={stats.series.map((d) => d.coveragePercent)}
              format={formatDistance}
            />
            <TrendCard
              title="Grazing"
              series={stats.series.map((d) => d.grazingMinutes)}
              hasData={stats.series.map((d) => d.hasData)}
              coverage={stats.series.map((d) => d.coveragePercent)}
              format={formatDuration}
              color="#22C55E"
            />
            <TrendCard
              title="Resting"
              series={stats.series.map((d) => d.restingMinutes)}
              hasData={stats.series.map((d) => d.hasData)}
              coverage={stats.series.map((d) => d.coveragePercent)}
              format={formatDuration}
              color="#94A3B8"
            />

            <Card variant="elevated" radius="xl" style={styles.card}>
              <ThemedText type="heading">Compared to its own normal</ThemedText>
              {baseline?.ready ? (
                <>
                  <RangeBand label="Distance" metric={baseline.metrics.distanceM} format={formatDistance} />
                  <RangeBand label="Grazing" metric={baseline.metrics.grazingMinutes} format={formatDuration} />
                  <RangeBand label="Resting" metric={baseline.metrics.restingMinutes} format={formatDuration} />
                  <ThemedText type="caption" themeColor="textSecondary">
                    Band shows this animal&apos;s usual range over {baseline.windowDays} days. A dot
                    outside it means today is unusual for them.
                  </ThemedText>
                </>
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  Learning this animal ({baseline?.sampleDays ?? 0} of 5 days with good coverage).
                </ThemedText>
              )}
            </Card>
          </>
        ) : null}
      </QueryBoundary>
    </ScreenContainer>
  );
}

function TrendCard({
  title,
  series,
  hasData,
  coverage,
  format,
  color,
}: {
  title: string;
  series: number[];
  hasData: boolean[];
  coverage: (number | null)[];
  format: (v: number) => string;
  color?: string;
}) {
  const withData = series.filter((_, i) => hasData[i]);
  const average = withData.length ? withData.reduce((a, b) => a + b, 0) / withData.length : 0;
  // A day below 40% coverage must not be read as a real low.
  const patchy = coverage.filter((c) => c !== null && c < 40).length;

  return (
    <Card variant="elevated" radius="xl" style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText type="heading">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          avg {format(average)}
        </ThemedText>
      </View>
      <Sparkline values={series} hasData={hasData} height={56} color={color} />
      {patchy > 0 ? (
        <ThemedText type="caption" themeColor="onWarningSubtle">
          {patchy} day{patchy === 1 ? '' : 's'} had patchy coverage and may read low.
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: Space.lg },
  card: { gap: Space.md },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
