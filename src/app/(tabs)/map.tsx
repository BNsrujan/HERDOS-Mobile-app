import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';

// Load react-native-maps only on native platforms to avoid web build-time errors
let MapView: any;
let Marker: any;
let Polygon: any;
let Polyline: any;
if (Platform.OS !== 'web') {
  // require at runtime so web bundlers won't evaluate native modules
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default || RNMaps;
  Marker = RNMaps.Marker;
  Polygon = RNMaps.Polygon;
  Polyline = RNMaps.Polyline;
}

import ScreenContainer from '@/components/layout/screen-container';
import AllAnimalsSheet from '@/components/map/all-animals-sheet';
import AnimalCallout from '@/components/map/animal-callout';
import AnimalMarker from '@/components/map/animal-marker';
import FarmHeaderPill from '@/components/map/farm-header-pill';
import MapActionButton from '@/components/map/map-action-button';
import MapLayerToggle, { type MapLayer } from '@/components/map/map-layer-toggle';
import TrailControls, { type PlaybackSpeed, type TrailRange } from '@/components/map/trail-controls';
import TrailEndpointMarker from '@/components/map/trail-endpoint-marker';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/states';
import { Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCreateZone } from '@/hooks/mutations/use-create-zone';
import { useUpdateZoneShape } from '@/hooks/mutations/use-update-zone-shape';
import { useAnimalPositions } from '@/hooks/queries/use-animal-positions';
import { useFarm } from '@/hooks/queries/use-farm';
import { useRecentAnimals } from '@/hooks/queries/use-recent-animals';
import { useAnimalTrack } from '@/hooks/queries/use-animal-track';
import { useZones } from '@/hooks/queries/use-zones';
import type { Animal } from '@/types/animal';
import type { GeofencePoint } from '@/types/zone';
import { activityColor, toActivitySegments } from '@/utils/track-display';

// Used when /farm is unavailable so the map still renders. Matches the seeded farm.
const FALLBACK_FARM_CENTER = { lat: 13.4168, lng: 75.2588 };

export default function MapScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const mapRef = useRef<any>(null);
  const { data: farm, refetch: refetchFarm } = useFarm();
  const { data: positions, isLoading: positionsLoading, isError: positionsError, refetch: refetchPositions } = useAnimalPositions();
  const { data: recentAnimals = [] } = useRecentAnimals(10);
  const { data: zones = [] } = useZones();
  const { editZoneId, createZone, focusAnimalId, focusZoneId, layer: layerParam } = useLocalSearchParams<{
    editZoneId?: string;
    createZone?: string;
    focusAnimalId?: string;
    focusZoneId?: string;
    layer?: string;
  }>();
  const createZoneMutation = useCreateZone();
  const updateZoneShapeMutation = useUpdateZoneShape();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [draftPoints, setDraftPoints] = useState<GeofencePoint[]>([]);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [zoneName, setZoneName] = useState('');

  // ---- Trail layer -------------------------------------------------------
  const [layer, setLayer] = useState<MapLayer>(layerParam === 'trail' ? 'trail' : 'live');
  const [trailRange, setTrailRange] = useState<TrailRange>('today');
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const trailWindow = useMemo(() => {
    const now = new Date();
    if (trailRange === '7d') {
      const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { from: from.toISOString(), to: now.toISOString() };
    }
    const day = new Date(now);
    if (trailRange === 'yesterday') day.setDate(day.getDate() - 1);
    return { date: day.toISOString().slice(0, 10) };
  }, [trailRange]);

  const { data: track, isLoading: trailLoading } = useAnimalTrack(
    selectedAnimalId ?? undefined,
    trailWindow,
    layer === 'trail',
  );

  const trailSegments = useMemo(
    () => (track ? toActivitySegments(track.points) : []),
    [track],
  );

  // Playback advances the cursor along the path. The interval scales with the
  // chosen speed and is cleared whenever playback stops or the track changes.
  useEffect(() => {
    if (!playing || !track || track.points.length < 2) return undefined;

    const interval = setInterval(() => {
      setCursor((current) => {
        if (current >= track.points.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, Math.max(16, 120 / speed));

    return () => clearInterval(interval);
  }, [playing, speed, track]);

  // A new track invalidates the old cursor position.
  useEffect(() => {
    setCursor(0);
    setPlaying(false);
  }, [track?.animalId, track?.from]);

  // Frame the whole path when it loads, so the trail is never off-screen.
  useEffect(() => {
    if (layer !== 'trail' || !track?.points.length || !mapRef.current) return;

    mapRef.current.fitToCoordinates(
      track.points.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      { edgePadding: { top: 120, right: 60, bottom: 320, left: 60 }, animated: true },
    );
  }, [layer, track]);

  const closeTrail = useCallback(() => {
    setLayer('live');
    setPlaying(false);
    setCursor(0);
  }, []);

  const initialRegion = useMemo<Region>(() => {
    const center = farm ?? FALLBACK_FARM_CENTER;

    return {
      latitude: center.lat,
      longitude: center.lng,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  }, [farm]);

  const selectedPosition = useMemo(() => positions?.find((position) => position.animalId === selectedAnimalId), [positions, selectedAnimalId]);
  const selectedAnimal = useMemo(() => recentAnimals.find((animal) => animal.id === selectedAnimalId), [recentAnimals, selectedAnimalId]);

  const handleRecenter = useCallback(() => {
    mapRef.current?.animateToRegion(initialRegion, 400);
  }, [initialRegion]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['animal-positions'] }),
      queryClient.invalidateQueries({ queryKey: ['farm'] }),
    ]);
    await Promise.all([refetchPositions(), refetchFarm()]);
  }, [queryClient, refetchFarm, refetchPositions]);

  const handleSelectAnimal = useCallback(
    (animal: Animal) => {
      const position = positions?.find((entry) => entry.animalId === animal.id);
      if (!position) {
        return;
      }

      setSelectedAnimalId(animal.id);
      mapRef.current?.animateToRegion(
        {
          latitude: position.lat,
          longitude: position.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400
      );
    },
    [positions]
  );

  const handleAddDraftPoint = useCallback((coordinate: GeofencePoint) => {
    setDraftPoints((current) => [...current, coordinate]);
  }, []);

  const handleCancelDraft = useCallback(() => {
    setDraftPoints([]);
    setZoneName('');
    router.replace('/zones' as never);
  }, [router]);

  const handleSaveEdit = useCallback(() => {
    if (!editZoneId || !draftPoints.length) {
      return;
    }

    updateZoneShapeMutation.mutate(
      { id: editZoneId, points: draftPoints },
      { onSuccess: () => router.replace('/zones' as never) },
    );
  }, [draftPoints, editZoneId, router, updateZoneShapeMutation]);

  const handleSaveCreate = useCallback(() => {
    if (draftPoints.length < 3 || !zoneName.trim()) {
      return;
    }

    createZoneMutation.mutate(
      { name: zoneName.trim(), points: draftPoints },
      { onSuccess: () => router.replace('/zones' as never) },
    );
  }, [createZoneMutation, draftPoints, router, zoneName]);

  useEffect(() => {
    if (!selectedAnimalId && positions?.length) {
      setSelectedAnimalId(positions[0].animalId);
    }
  }, [positions, selectedAnimalId]);

  useEffect(() => {
    if (!editZoneId || !zones.length) {
      return;
    }

    const targetZone = zones.find((zone) => zone.id === editZoneId);

    if (!targetZone) {
      return;
    }

    setDraftPoints(targetZone.points.map((point) => ({ ...point })));
  }, [editZoneId, zones]);

  useEffect(() => {
    // Only reset when leaving draft mode entirely - in edit mode the polygon is
    // loaded by the editZoneId effect above and must not be cleared here.
    if (createZone !== 'true' && !editZoneId) {
      setDraftPoints([]);
      setZoneName('');
      setNameModalVisible(false);
    }
  }, [createZone, editZoneId]);

  useEffect(() => {
    if (!focusAnimalId || !positions?.length) {
      return;
    }

    const targetId = Array.isArray(focusAnimalId) ? focusAnimalId[0] : focusAnimalId;
    const targetPosition = positions.find((position) => position.animalId === targetId);

    if (!targetPosition) {
      return;
    }

    setSelectedAnimalId(targetId);
    mapRef.current?.animateToRegion(
      {
        latitude: targetPosition.lat,
        longitude: targetPosition.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      400,
    );
  }, [focusAnimalId, positions]);

  useEffect(() => {
    if (!focusZoneId || !zones.length) {
      return;
    }

    const targetId = Array.isArray(focusZoneId) ? focusZoneId[0] : focusZoneId;
    const targetZone = zones.find((zone) => zone.id === targetId);

    if (!targetZone?.points.length) {
      return;
    }

    const latitudes = targetZone.points.map((point) => point.lat);
    const longitudes = targetZone.points.map((point) => point.lng);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    mapRef.current?.animateToRegion(
      {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.02),
        longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.02),
      },
      400,
    );
  }, [focusZoneId, zones]);

  if (positionsLoading) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <LoadingState />
      </ScreenContainer>
    );
  }

  if (positionsError) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <ThemedText type="title">Unable to load map</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Check your connection and try again.
        </ThemedText>
        <Button label="Retry" onPress={handleRefresh} />
      </ScreenContainer>
    );
  }

  const isDraftMode = Boolean(editZoneId || createZone === 'true');
  const canSaveCreate = draftPoints.length >= 3;

  if (Platform.OS === 'web') {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <ThemedText type="title" style={styles.centerText}>
          Map is not available in web preview
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          Please open this screen on a device or simulator.
        </ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.map}
        mapType="satellite"
        initialRegion={initialRegion}
        onPress={(event: any) => {
          if (createZone !== 'true') {
            return;
          }

          handleAddDraftPoint({
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude,
          });
        }}
        onLongPress={(event: any) => {
          if (!editZoneId || draftPoints.length < 2) {
            return;
          }

          const target = {
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude,
          };

          const distanceTo = (point: GeofencePoint) => Math.hypot(point.lat - target.lat, point.lng - target.lng);
          const nearestIndex = draftPoints.reduce(
            (bestIndex, point, index) => (distanceTo(point) < distanceTo(draftPoints[bestIndex]) ? index : bestIndex),
            0,
          );

          const nextIndex = (nearestIndex + 1) % draftPoints.length;
          const insertIndex = Math.min(nearestIndex, nextIndex) + 1;
          const inserted = [...draftPoints];
          inserted.splice(insertIndex, 0, target);
          setDraftPoints(inserted);
        }}
      >
        {zones.filter((zone) => zone.active).map((zone) => (
          <Fragment key={zone.id}>
            <Polygon
              coordinates={zone.points.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
              strokeColor={editZoneId === zone.id ? '#0F766E' : '#14B8A6'}
              fillColor={editZoneId === zone.id ? 'rgba(15,118,110,0.18)' : 'rgba(20,184,166,0.2)'}
              strokeWidth={2}
              tappable={false}
            />
            {zone.points.map((point, index) => (
              <Marker key={`${zone.id}-${index}`} coordinate={{ latitude: point.lat, longitude: point.lng }}>
                <View style={styles.vertexMarker} />
              </Marker>
            ))}
          </Fragment>
        ))}

        {editZoneId && draftPoints.length ? (
          <>
            <Polygon
              coordinates={draftPoints.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
              strokeColor="#0F766E"
              fillColor="rgba(15,118,110,0.18)"
              strokeWidth={2}
            />
            {draftPoints.map((point, index) => (
              <Marker
                key={`draft-${index}`}
                coordinate={{ latitude: point.lat, longitude: point.lng }}
                draggable
                onDragEnd={(event: any) => {
                  const nextPoints = [...draftPoints];
                  nextPoints[index] = {
                    lat: event.nativeEvent.coordinate.latitude,
                    lng: event.nativeEvent.coordinate.longitude,
                  };
                  setDraftPoints(nextPoints);
                }}
              >
                <View style={styles.vertexMarker} />
              </Marker>
            ))}
          </>
        ) : null}

        {createZone === 'true' && draftPoints.length > 1 ? (
          <Polyline
            coordinates={draftPoints.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
            strokeColor="#0F766E"
            strokeWidth={2}
          />
        ) : null}

        {createZone === 'true' && draftPoints.map((point, index) => (
          <Marker key={`create-${index}`} coordinate={{ latitude: point.lat, longitude: point.lng }}>
            <View style={styles.vertexMarker} />
          </Marker>
        ))}

        {/* Trail: one Polyline per activity run, so the path itself shows what the
            animal was doing rather than needing a legend. */}
        {layer === 'trail' && trailSegments.map((segment, index) => (
          <Polyline
            key={`trail-${index}`}
            coordinates={segment.points.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
            strokeColor={activityColor(segment.activity)}
            strokeWidth={5}
            zIndex={2}
          />
        ))}

        {layer === 'trail' && track && track.points.length > 1 ? (
          <>
            <TrailEndpointMarker lat={track.points[0].lat} lng={track.points[0].lng} kind="start" />
            <TrailEndpointMarker
              lat={track.points[track.points.length - 1].lat}
              lng={track.points[track.points.length - 1].lng}
              kind="end"
            />
            {track.points[cursor] ? (
              <TrailEndpointMarker
                lat={track.points[cursor].lat}
                lng={track.points[cursor].lng}
                kind="cursor"
              />
            ) : null}
          </>
        ) : null}

        {/* Live markers are the base layer; hidden while a trail is on screen so
            the path stays readable. */}
        {layer !== 'trail' && positions?.map((position) => (
          <AnimalMarker key={position.animalId} position={position} onPress={() => setSelectedAnimalId(position.animalId)} />
        ))}
        {layer !== 'trail' && selectedPosition && selectedAnimal ? (
          <Marker coordinate={{ latitude: selectedPosition.lat, longitude: selectedPosition.lng }} anchor={{ x: 0.5, y: 1 }}>
            <AnimalCallout animal={selectedAnimal} position={selectedPosition} />
          </Marker>
        ) : null}
      </MapView>

      {farm ? (
        <FarmHeaderPill name={farm.name} onlineCount={farm.onlineCount} totalCount={farm.totalCount} />
      ) : null}

      <View style={styles.actionStack}>
        <MapActionButton icon="crosshair" onPress={handleRecenter} accessibilityLabel="Recenter map" />
        <MapActionButton icon="refresh" onPress={handleRefresh} accessibilityLabel="Refresh positions" />
        <MapActionButton icon="fence" onPress={() => router.push('/zones')} accessibilityLabel="Manage fences" />
      </View>

      {isDraftMode ? (
        <View style={styles.draftActions}>
          {createZone === 'true' ? (
            <>
              <Button
                variant="secondary"
                label="Undo last point"
                disabled={draftPoints.length === 0}
                onPress={() => setDraftPoints((current) => current.slice(0, -1))}
                style={styles.flexButton}
              />
              <Button
                label="Name & Save"
                disabled={!canSaveCreate}
                loading={createZoneMutation.isPending}
                onPress={() => setNameModalVisible(true)}
                style={styles.flexButton}
              />
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                label="Cancel"
                onPress={handleCancelDraft}
                style={styles.flexButton}
              />
              <Button
                label="Save"
                loading={updateZoneShapeMutation.isPending}
                onPress={handleSaveEdit}
                style={styles.flexButton}
              />
            </>
          )}
          {createZone === 'true' ? (
            <Button
              variant="secondary"
              label="Cancel"
              onPress={handleCancelDraft}
              style={styles.flexButton}
            />
          ) : null}
        </View>
      ) : null}

      <Modal visible={nameModalVisible} transparent animationType="slide">
        <View style={[styles.modalBackdrop, { backgroundColor: theme.overlay }]}>
          <Card variant="elevated" padding="xl" radius="xl" style={styles.modalCard}>
            <ThemedText type="heading">Name this zone</ThemedText>
            <Input value={zoneName} onChangeText={setZoneName} placeholder="Zone name" autoFocus />
            <View style={styles.modalActions}>
              <Button variant="secondary" label="Cancel" onPress={() => setNameModalVisible(false)} />
              <Button
                label="Save"
                disabled={!zoneName.trim()}
                loading={createZoneMutation.isPending}
                onPress={() => {
                  setNameModalVisible(false);
                  handleSaveCreate();
                }}
              />
            </View>
          </Card>
        </View>
      </Modal>

      {!isDraftMode ? (
        <View style={styles.layerRail}>
          {/* Graze / Range / Signal land in later phases. */}
          <MapLayerToggle value={layer} onChange={setLayer} disabled={['graze', 'range', 'signal']} />
        </View>
      ) : null}

      {layer === 'trail' && track ? (
        <TrailControls
          track={track}
          range={trailRange}
          onRangeChange={setTrailRange}
          cursor={cursor}
          onCursorChange={setCursor}
          playing={playing}
          onTogglePlay={() => setPlaying((v) => !v)}
          speed={speed}
          onSpeedChange={setSpeed}
          onClose={closeTrail}
        />
      ) : layer === 'trail' && trailLoading ? (
        <View style={styles.trailLoading}>
          <LoadingState size="sm" label="Loading trail" />
        </View>
      ) : layer !== 'trail' ? (
        <AllAnimalsSheet animals={recentAnimals} onSelect={handleSelectAnimal} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.md,
  },
  centerText: {
    textAlign: 'center',
  },
  actionStack: {
    position: 'absolute',
    right: Space.lg,
    top: 96,
    zIndex: 3,
  },
  draftActions: {
    position: 'absolute',
    left: Space.lg,
    right: Space.lg,
    bottom: 104,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  flexButton: {
    flex: 1,
  },
  layerRail: {
    position: 'absolute',
    left: Space.lg,
    right: Space.lg,
    bottom: 150,
    alignItems: 'center',
    zIndex: 4,
  },
  trailLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 120,
    zIndex: 5,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Space.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    gap: Space.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Space.md,
  },
  vertexMarker: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#14B8A6',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
