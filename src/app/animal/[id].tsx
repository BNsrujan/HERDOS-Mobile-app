import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import ActivityTimelineBar from '@/components/animal-detail/activity-timeline-bar';
import AlertHistoryItem from '@/components/animal-detail/alert-history-item';
import CollarActions from '@/components/animal-detail/collar-actions';
import LocateSheet, { type LocateSheetHandle } from '@/components/animal-detail/locate-sheet';
import LocationCard from '@/components/animal-detail/location-card';
import FixQualityRow from '@/components/animal-detail/fix-quality-row';
import MovementCard from '@/components/animal-detail/movement-card';
import ShutdownSheet, { type ShutdownSheetHandle } from '@/components/animal-detail/shutdown-sheet';
import VitalsRow from '@/components/animal-detail/vitals-row';
import ScreenContainer from '@/components/layout/screen-container';
import ScreenHeader from '@/components/layout/screen-header';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { QueryBoundary } from '@/components/ui/states';
import { getAvatarColor } from '@/components/herd/avatar';
import StatusBadge from '@/components/herd/status-badge';
import { ThemedText } from '@/components/themed-text';
import { Radius, Space } from '@/constants/theme';
import { useActivityTimeline } from '@/hooks/queries/use-activity-timeline';
import { useAnimalAlertHistory } from '@/hooks/queries/use-animal-alert-history';
import { useAnimalDetail } from '@/hooks/queries/use-animal-detail';
import { useAnimalTrack } from '@/hooks/queries/use-animal-track';
import { useDailyStats } from '@/hooks/queries/use-daily-stats';
import { useFixQuality } from '@/hooks/queries/use-fix-quality';

export default function AnimalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [expanded, setExpanded] = useState(true);
  const locateSheetRef = useRef<LocateSheetHandle>(null);
  const shutdownSheetRef = useRef<ShutdownSheetHandle>(null);
  const { data: animal, isLoading, isError, refetch } = useAnimalDetail(id);
  const { data: timelineData } = useActivityTimeline(id);
  const { data: alertHistory = [] } = useAnimalAlertHistory(id);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { data: track } = useAnimalTrack(id, { date: today });
  const { data: dailyStats } = useDailyStats(id, 7);
  const { data: fixQuality } = useFixQuality(id, 7);

  const heroBackground = useMemo(() => (animal ? getAvatarColor(animal.name) : '#2563EB'), [animal]);

  const handleViewOnMap = () => {
    if (!id) {
      return;
    }

    router.push(`/(tabs)/map?focusAnimalId=${id}`);
  };

  const handleViewTrail = () => {
    if (!id) return;
    router.push(`/(tabs)/map?focusAnimalId=${id}&layer=trail`);
  };

  if (isLoading || isError || !animal) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <QueryBoundary
          isLoading={isLoading}
          isError={isError || !animal}
          onRetry={refetch}
          error={{ description: 'Unable to load this animal.' }}
        >
          {null}
        </QueryBoundary>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scroll
      edges={['top', 'bottom']}
      contentContainerStyle={styles.content}
      header={<ScreenHeader title={animal.name} back />}
      floating={
        <>
          <LocateSheet ref={locateSheetRef} animalId={animal.id} animalName={animal.name} />
          <ShutdownSheet ref={shutdownSheetRef} animalId={animal.id} animalName={animal.name} />
        </>
      }
    >

        <View style={styles.heroCard}>
          {animal.photoUrl ? (
            <Image source={{ uri: animal.photoUrl }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: heroBackground }]} />
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <StatusBadge status={animal.status} />
            </View>
            <View style={styles.heroTextBlock}>
              <ThemedText type="heading" style={styles.heroTitle}>{animal.name}</ThemedText>
              <ThemedText type="small" style={styles.heroSubtitle}>
                {animal.breed} • ID: {animal.collarId}
              </ThemedText>
            </View>
          </View>
        </View>

        <VitalsRow
          bodyTempC={animal.bodyTempC}
          activityPercent={animal.activityPercent}
          ruminationHours={animal.ruminationHours}
        />

        <MovementCard
          distanceTodayMeters={animal.distanceTodayMeters}
          todayPoints={track?.points ?? []}
          series={dailyStats?.series ?? []}
          coveragePercent={track?.coveragePercent ?? null}
          onPress={handleViewTrail}
        />

        <LocationCard lat={animal.lastKnownLat} lng={animal.lastKnownLng} onExpand={handleViewOnMap} />

        <Card variant="elevated" radius="xl" style={styles.card}>
          <ThemedText type="heading">Today&apos;s Activity</ThemedText>
          <ActivityTimelineBar segments={timelineData?.segments ?? []} />
        </Card>

        {fixQuality && fixQuality.totalFixes > 0 ? (
          <Card variant="sunken" radius="xl" style={styles.card}>
            <FixQualityRow quality={fixQuality} />
          </Card>
        ) : null}

        <CollarActions
          onLocatePress={() => locateSheetRef.current?.present()}
          onViewMap={handleViewOnMap}
          onShutdownPress={() => shutdownSheetRef.current?.present()}
        />

        <Card variant="elevated" radius="xl" style={styles.card}>
          <AppPressable
            onPress={() => setExpanded((value) => !value)}
            accessibilityLabel="Toggle alert history"
            accessibilityState={{ expanded }}
            minTouchTarget={false}
            style={styles.expandHeader}
          >
            <ThemedText type="heading">Alert History</ThemedText>
            <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={18} />
          </AppPressable>
          {expanded ? (
            <View style={styles.historyList}>
              {alertHistory.length ? (
                alertHistory.map((alert) => <AlertHistoryItem key={alert.id} alert={alert} />)
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  No resolved alerts yet.
                </ThemedText>
              )}
            </View>
          ) : null}
        </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
  content: {
    gap: Space.lg,
  },
  heroCard: {
    height: 220,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  heroContent: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: Space.lg,
  },
  badgeRow: {
    alignItems: 'flex-start',
  },
  heroTextBlock: {
    gap: Space.xs,
  },
  // Fixed light text: the hero always sits on a darkened photo overlay.
  heroTitle: {
    color: '#FFFFFF',
  },
  heroSubtitle: {
    color: '#E5E7EB',
  },
  card: {
    gap: Space.md,
  },
  expandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyList: {
    gap: Space.sm,
  },
});
