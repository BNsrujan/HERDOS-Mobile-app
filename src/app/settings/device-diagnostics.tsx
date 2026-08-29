import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { QueryBoundary } from '@/components/ui/states';
import { Radius, Space } from '@/constants/theme';
import { useDeviceDiagnostics } from '@/hooks/queries/use-device-diagnostics';
import { useTheme } from '@/hooks/use-theme';
import { formatRelativeTime } from '@/utils/format-time';

export default function DeviceDiagnosticsScreen() {
  const theme = useTheme();
  const { data, isLoading, isError, refetch } = useDeviceDiagnostics();
  const collars = useMemo(() => data?.collars ?? [], [data]);

  const batteryColor = (percent: number) => {
    if (percent > 50) return theme.success;
    if (percent >= 20) return theme.warning;
    return theme.danger;
  };

  return (
    <ScreenContainer scroll edges={['bottom']} contentContainerStyle={styles.content}>
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={!collars.length}
        onRetry={refetch}
        empty={{
          title: 'No collars reporting',
          description: 'Diagnostics appear once a collar has synced through the base station.',
        }}
      >
        {collars.map((collar) => (
          <Card key={collar.id} variant="elevated" style={styles.card}>
            <ThemedText type="smallBold">{collar.animalName}</ThemedText>

            <View style={styles.metricRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Battery
              </ThemedText>
              <ThemedText type="smallBold">{collar.batteryPercent}%</ThemedText>
            </View>
            <View style={[styles.barTrack, { backgroundColor: theme.surfaceSunken }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.max(0, Math.min(100, collar.batteryPercent))}%`,
                    backgroundColor: batteryColor(collar.batteryPercent),
                  },
                ]}
              />
            </View>

            <View style={styles.metricRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Signal
              </ThemedText>
              <ThemedText type="smallBold">{collar.signalStrength} dBm</ThemedText>
            </View>

            <ThemedText type="caption" themeColor="textSecondary">
              Last sync: {formatRelativeTime(collar.lastSyncAt)}
            </ThemedText>
          </Card>
        ))}
      </QueryBoundary>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.lg,
  },
  card: {
    gap: Space.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barTrack: {
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
