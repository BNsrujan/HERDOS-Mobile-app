import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AlertFilterChips, { type AlertFilter } from '@/components/alerts/alert-filter-chips';
import AlertRow from '@/components/alerts/alert-row';
import CriticalAlertBanner from '@/components/alerts/critical-alert-banner';
import ScreenContainer from '@/components/layout/screen-container';
import ScreenHeader from '@/components/layout/screen-header';
import { ThemedText } from '@/components/themed-text';
import { QueryBoundary } from '@/components/ui/states';
import { Space } from '@/constants/theme';
import { useAlerts } from '@/hooks/queries/use-alerts';
import { useResolveAlert } from '@/hooks/queries/use-resolve-alert';
import { groupAlertsByDay } from '@/utils/day-group';

export default function AlertsScreen() {
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { data: alerts = [], isLoading, isError, refetch } = useAlerts({ limit: 50 });
  const { mutate: resolveAlert, variables: resolvingId, isPending } = useResolveAlert();

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
    <ScreenContainer
      scroll
      hasTabBar
      edges={['top']}
      refreshing={refreshing}
      onRefresh={onRefresh}
      header={
        <>
          <ScreenHeader title="Alerts" subtitle="Stay on top of health events and geofence changes." />
          <AlertFilterChips value={filter} onChange={setFilter} />
        </>
      }
    >
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        error={{ description: 'Unable to load alerts. Please try again.' }}
      >
        <CriticalAlertBanner alert={criticalAlert} />

        {!filteredAlerts.length ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
            No alerts match this filter.
          </ThemedText>
        ) : (
          Object.entries(groupedAlerts).map(([day, dayAlerts]) => (
            <View key={day} style={styles.group}>
              <ThemedText type="overline" themeColor="textSecondary" style={styles.dayLabel}>
                {day}
              </ThemedText>
              {dayAlerts.map((alert) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  // Only the row actually being resolved should show a pending state.
                  isResolving={isPending && resolvingId === alert.id}
                  onResolve={() => resolveAlert(alert.id)}
                />
              ))}
            </View>
          ))
        )}
      </QueryBoundary>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: Space['3xl'],
    textAlign: 'center',
  },
  group: {
    marginBottom: Space.lg,
  },
  dayLabel: {
    marginBottom: Space.sm,
  },
});
