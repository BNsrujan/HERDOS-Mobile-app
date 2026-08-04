import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AlertRow from '@/components/home/alert-row';
import HealthSummaryCard from '@/components/home/health-summary-card';
import RecentActivityRow from '@/components/home/recent-activity-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlerts } from '@/hooks/queries/use-alerts';
import { useFarm } from '@/hooks/queries/use-farm';
import { useHerdSummary } from '@/hooks/queries/use-herd-summary';
import { useRecentAnimals } from '@/hooks/queries/use-recent-animals';
import { useWeather } from '@/hooks/use-weather';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { data: summary } = useHerdSummary();
  const { data: alerts, refetch: refetchAlerts } = useAlerts({ limit: 2, acknowledged: false });
  const { data: recentAnimals } = useRecentAnimals(3);
  const { data: weather, isFetching: weatherLoading, isError: weatherError } = useWeather();
  const { refetch: refetchFarm } = useFarm();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchAlerts(), refetchFarm()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchAlerts, refetchFarm]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.logo}>HERDOS</Text>
            <ThemedText type="small">Herd health and activity</ThemedText>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/alerts')} style={styles.bellButton}>
            <Text style={styles.bell}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateRow}>
          <ThemedText type="small">{formatDate(new Date())}</ThemedText>
          {!weatherError && weather && (
            <View style={styles.weatherChip}>
              <Text style={styles.weatherText}>{weather.condition}</Text>
              <Text style={styles.weatherTemp}>{Math.round(weather.tempC)}°C</Text>
            </View>
          )}
          {weatherLoading && !weather && !weatherError && (
            <View style={[styles.weatherChip, styles.weatherLoading]}>
              <ActivityIndicator size="small" color="#6B7280" />
            </View>
          )}
        </View>

        {summary ? (
          <HealthSummaryCard healthy={summary.healthy} watch={summary.watch} alert={summary.alert} />
        ) : (
          <View style={styles.loadingCard}>
            <ActivityIndicator />
          </View>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Needs Attention</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/alerts')}>
            <ThemedText type="link">View All</ThemedText>
          </TouchableOpacity>
        </View>

        {alerts?.length ? (
          alerts.map((alert) => <AlertRow key={alert.id} alert={alert} onPress={() => router.push('/(tabs)/alerts')} />)
        ) : (
          <View style={styles.emptyState}>
            <ThemedText type="small">All clear</ThemedText>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recent Activity</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/herd')}>
            <ThemedText type="link">More</ThemedText>
          </TouchableOpacity>
        </View>

        {recentAnimals?.length ? (
          <RecentActivityRow animals={recentAnimals} onSeeMore={() => router.push('/(tabs)/herd')} />
        ) : (
          <View style={styles.emptyState}>
            <ThemedText type="small">No recent activity</ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bell: {
    fontSize: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  weatherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  weatherLoading: {
    width: 80,
  },
  weatherText: {
    fontSize: 14,
    color: '#111827',
  },
  weatherTemp: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
  },
  loadingCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
