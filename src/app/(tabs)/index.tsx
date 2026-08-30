import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import AlertRow from '@/components/alerts/alert-row';
import HealthSummaryCard from '@/components/home/health-summary-card';
import HerdCohesionCard from '@/components/home/herd-cohesion-card';
import RecentActivityRow from '@/components/home/recent-activity-row';
import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { LoadingState } from '@/components/ui/states';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useAlerts } from '@/hooks/queries/use-alerts';
import { useFarm } from '@/hooks/queries/use-farm';
import { useHerdCohesion } from '@/hooks/queries/use-herd-cohesion';
import { useHerdSummary } from '@/hooks/queries/use-herd-summary';
import { useRecentAnimals } from '@/hooks/queries/use-recent-animals';
import { useResolveAlert } from '@/hooks/queries/use-resolve-alert';
import { useTheme } from '@/hooks/use-theme';
import { useWeather } from '@/hooks/use-weather';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { data: summary } = useHerdSummary();
  const { data: alerts, refetch: refetchAlerts } = useAlerts({ limit: 2, acknowledged: false });
  const { data: recentAnimals } = useRecentAnimals(3);
  const { data: cohesion } = useHerdCohesion();
  const { data: weather, isFetching: weatherLoading, isError: weatherError } = useWeather();
  const { refetch: refetchFarm } = useFarm();
  const { mutate: resolveAlert, variables: resolvingId, isPending } = useResolveAlert();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchAlerts(), refetchFarm()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchAlerts, refetchFarm]);

  return (
    <ScreenContainer
      scroll
      hasTabBar
      edges={['top']}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerRow}>
        <View>
          <Image
            source={require('@/assets/images/logo-glow.png')}
            style={styles.logo}
            accessibilityLabel="HerdOS logo"
          />
          {/* <ThemedText type="small" themeColor="textSecondary">
            Herd health and activity
          </ThemedText> */}
        </View>
        <AppPressable
          onPress={() => router.push('/(tabs)/alerts')}
          accessibilityLabel="View alerts"
          minTouchTarget={false}
          style={[styles.bellButton, { backgroundColor: theme.surfaceSunken }]}
        >
          <Icon name="bell" size={20} />
        </AppPressable>
      </View>

      <View style={styles.dateRow}>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDate(new Date())}
        </ThemedText>
        {!weatherError && weather ? (
          <View style={[styles.weatherChip, { backgroundColor: theme.surfaceSunken }]}>
            <ThemedText type="small">{weather.condition}</ThemedText>
            <ThemedText type="smallBold">{Math.round(weather.tempC)}°C</ThemedText>
          </View>
        ) : null}
        {weatherLoading && !weather && !weatherError ? (
          <View style={[styles.weatherChip, styles.weatherLoading, { backgroundColor: theme.surfaceSunken }]}>
            <LoadingState size="sm" />
          </View>
        ) : null}
      </View>

      {summary ? (
        <HealthSummaryCard healthy={summary.healthy} watch={summary.watch} alert={summary.alert} />
      ) : (
        <Card variant="sunken">
          <LoadingState size="sm" />
        </Card>
      )}

      {cohesion ? (
        <HerdCohesionCard cohesion={cohesion} onPress={() => router.push('/(tabs)/map')} />
      ) : null}

      <View style={styles.sectionHeader}>
        <ThemedText type="heading">Needs Attention</ThemedText>
        <Button variant="ghost" size="sm" label="View All" onPress={() => router.push('/(tabs)/alerts')} />
      </View>

      {alerts?.length ? (
        alerts.map((alert) => (
          <AlertRow
            key={alert.id}
            alert={alert}
            isResolving={isPending && resolvingId === alert.id}
            onResolve={() => resolveAlert(alert.id)}
          />
        ))
      ) : (
        <Card variant="sunken">
          <ThemedText type="small" themeColor="textSecondary">
            All clear
          </ThemedText>
        </Card>
      )}

      <View style={styles.sectionHeader}>
        <ThemedText type="heading">Recent Activity</ThemedText>
        <Button variant="ghost" size="sm" label="More" onPress={() => router.push('/(tabs)/herd')} />
      </View>

      {recentAnimals?.length ? (
        <RecentActivityRow animals={recentAnimals} onSeeMore={() => router.push('/(tabs)/herd')} />
      ) : (
        <Card variant="sunken">
          <ThemedText type="small" themeColor="textSecondary">
            No recent activity
          </ThemedText>
        </Card>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space['2xl'],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -10,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  bellButton: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  weatherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.md,
    borderRadius: Radius.full,
  },
  weatherLoading: {
    width: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
