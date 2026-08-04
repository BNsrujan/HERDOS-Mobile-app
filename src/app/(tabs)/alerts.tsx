import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import AlertFilterChips, { type AlertFilter } from '@/components/alerts/alert-filter-chips';
import AlertRow from '@/components/alerts/alert-row';
import CriticalAlertBanner from '@/components/alerts/critical-alert-banner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlerts } from '@/hooks/queries/use-alerts';
import { useResolveAlert } from '@/hooks/queries/use-resolve-alert';
import { groupAlertsByDay } from '@/utils/day-group';

export default function AlertsScreen() {
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { data: alerts = [], isLoading, isError, refetch } = useAlerts({ limit: 50 });
  const { mutate: resolveAlert, isPending: isResolving } = useResolveAlert();

  const filteredAlerts = useMemo(() => {
    const sorted = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    switch (filter) {
      case 'active':
        return sorted.filter((alert) => !alert.acknowledged);
      case 'resolved':
        return sorted.filter((alert) => Boolean(alert.acknowledged));
      default:
        return sorted;
    }
  }, [alerts, filter]);

  const criticalAlert = useMemo(
    () => filteredAlerts.find((alert) => alert.type === 'panic' && !alert.acknowledged),
    [filteredAlerts],
  );

  const groupedAlerts = useMemo(() => groupAlertsByDay(filteredAlerts), [filteredAlerts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title">Alerts</ThemedText>
          <ThemedText type="small">Stay on top of health events and geofence changes.</ThemedText>
        </View>

        <AlertFilterChips value={filter} onChange={setFilter} />

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <ThemedText type="small">Unable to load alerts. Please try again.</ThemedText>
          </View>
        ) : (
          <>
            <CriticalAlertBanner alert={criticalAlert} />

            {!filteredAlerts.length ? (
              <View style={styles.emptyState}>
                <ThemedText type="small">No alerts match this filter.</ThemedText>
              </View>
            ) : (
              Object.entries(groupedAlerts).map(([day, dayAlerts]) => (
                <View key={day} style={styles.group}>
                  <ThemedText type="smallBold" style={styles.dayLabel}>
                    {day}
                  </ThemedText>
                  {dayAlerts.map((alert) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      isResolving={isResolving}
                      onResolve={() => resolveAlert(alert.id)}
                    />
                  ))}
                </View>
              ))
            )}
          </>
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
    paddingBottom: 80,
  },
  header: {
    gap: 6,
    marginBottom: 12,
  },
  centered: {
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
  },
  group: {
    marginBottom: 16,
  },
  dayLabel: {
    marginBottom: 8,
    color: '#6B7280',
  },
});
