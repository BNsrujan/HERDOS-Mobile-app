import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import ActivityTimelineBar from '@/components/animal-detail/activity-timeline-bar';
import AlertHistoryItem from '@/components/animal-detail/alert-history-item';
import CollarActions from '@/components/animal-detail/collar-actions';
import LocateSheet, { type LocateSheetHandle } from '@/components/animal-detail/locate-sheet';
import LocationCard from '@/components/animal-detail/location-card';
import ShutdownSheet, { type ShutdownSheetHandle } from '@/components/animal-detail/shutdown-sheet';
import VitalsRow from '@/components/animal-detail/vitals-row';
import { getAvatarColor } from '@/components/herd/avatar';
import StatusBadge from '@/components/herd/status-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useActivityTimeline } from '@/hooks/queries/use-activity-timeline';
import { useAnimalAlertHistory } from '@/hooks/queries/use-animal-alert-history';
import { useAnimalDetail } from '@/hooks/queries/use-animal-detail';

export default function AnimalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [expanded, setExpanded] = useState(true);
  const locateSheetRef = useRef<LocateSheetHandle>(null);
  const shutdownSheetRef = useRef<ShutdownSheetHandle>(null);
  const { data: animal, isLoading, isError, refetch } = useAnimalDetail(id);
  const { data: timelineData } = useActivityTimeline(id);
  const { data: alertHistory = [] } = useAnimalAlertHistory(id);

  const heroBackground = useMemo(() => (animal ? getAvatarColor(animal.name) : '#2563EB'), [animal]);

  const handleViewOnMap = () => {
    if (!id) {
      return;
    }

    router.push(`/(tabs)/map?focusAnimalId=${id}`);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#22C55E" />
      </ThemedView>
    );
  }

  if (isError || !animal) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Unable to load animal</ThemedText>
        <Pressable onPress={() => refetch()} style={styles.retryButton}>
          <ThemedText type="smallBold">Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ThemedText type="smallBold">←</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle">{animal.name}</ThemedText>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.heroCard}>
          {animal.photoUrl ? (
            <Image source={{ uri: animal.photoUrl }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroFallback, { backgroundColor: heroBackground }]} />
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <StatusBadge status={animal.status} />
            </View>
            <View style={styles.heroTextBlock}>
              <ThemedText type="subtitle" style={styles.heroTitle}>{animal.name}</ThemedText>
              <ThemedText type="small" style={styles.heroSubtitle}>{animal.breed} • ID: {animal.collarId}</ThemedText>
            </View>
          </View>
        </View>

        <VitalsRow
          bodyTempC={animal.bodyTempC}
          activityPercent={animal.activityPercent}
          ruminationHours={animal.ruminationHours}
        />

        <LocationCard lat={animal.lastKnownLat} lng={animal.lastKnownLng} onExpand={handleViewOnMap} />

        <View style={styles.card}>
          <ThemedText type="subtitle">Today's Activity</ThemedText>
          <ActivityTimelineBar segments={timelineData?.segments ?? []} />
        </View>

        <CollarActions
          onLocatePress={() => locateSheetRef.current?.present()}
          onViewMap={handleViewOnMap}
          onShutdownPress={() => shutdownSheetRef.current?.present()}
        />

        <View style={styles.card}>
          <Pressable onPress={() => setExpanded((value) => !value)} style={styles.expandHeader}>
            <ThemedText type="subtitle">Alert History</ThemedText>
            <ThemedText type="smallBold">{expanded ? '▾' : '▸'}</ThemedText>
          </Pressable>
          {expanded ? (
            <View style={styles.historyList}>
              {alertHistory.length ? (
                alertHistory.map((alert) => <AlertHistoryItem key={alert.id} alert={alert} />)
              ) : (
                <ThemedText type="small">No resolved alerts yet.</ThemedText>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {animal ? (
        <>
          <LocateSheet ref={locateSheetRef} animalId={animal.id} animalName={animal.name} />
          <ShutdownSheet ref={shutdownSheetRef} animalId={animal.id} animalName={animal.name} />
        </>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFallback: {
    backgroundColor: '#2563EB',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  heroContent: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    padding: 16,
  },
  badgeRow: {
    alignItems: 'flex-start',
  },
  heroTextBlock: {
    gap: 4,
  },
  heroTitle: {
    color: '#fff',
  },
  heroSubtitle: {
    color: '#F3F4F6',
  },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  expandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyList: {
    gap: 4,
  },
  retryButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
});
