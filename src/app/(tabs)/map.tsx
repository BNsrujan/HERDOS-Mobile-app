import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Platform, StyleSheet, TextInput, View } from 'react-native';
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

import AllAnimalsSheet from '@/components/map/all-animals-sheet';
import AnimalCallout from '@/components/map/animal-callout';
import AnimalMarker from '@/components/map/animal-marker';
import FarmHeaderPill from '@/components/map/farm-header-pill';
import MapActionButton from '@/components/map/map-action-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCreateZone } from '@/hooks/mutations/use-create-zone';
import { useUpdateZoneShape } from '@/hooks/mutations/use-update-zone-shape';
import { useAnimalPositions } from '@/hooks/queries/use-animal-positions';
import { useFarm } from '@/hooks/queries/use-farm';
import { useRecentAnimals } from '@/hooks/queries/use-recent-animals';
import { useZones } from '@/hooks/queries/use-zones';
import type { Animal } from '@/types/animal';
import type { GeofencePoint } from '@/types/zone';

export default function MapScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mapRef = useRef<any>(null);
  const { data: farm, isLoading: farmLoading, isError: farmError, refetch: refetchFarm } = useFarm();
  const { data: positions, isLoading: positionsLoading, isError: positionsError, refetch: refetchPositions } = useAnimalPositions();
  const { data: recentAnimals = [] } = useRecentAnimals(10);
  const { data: zones = [] } = useZones();
  const { editZoneId, createZone, focusAnimalId, focusZoneId } = useLocalSearchParams<{
    editZoneId?: string;
    createZone?: string;
    focusAnimalId?: string;
    focusZoneId?: string;
  }>();
  const createZoneMutation = useCreateZone();
  const updateZoneShapeMutation = useUpdateZoneShape();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [draftPoints, setDraftPoints] = useState<GeofencePoint[]>([]);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [zoneName, setZoneName] = useState('');

  const initialRegion = useMemo<Region | undefined>(() => {
    if (!farm) {
      return undefined;
    }

    return {
      latitude: farm.lat,
      longitude: farm.lng,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  }, [farm]);

  const selectedPosition = useMemo(() => positions?.find((position) => position.animalId === selectedAnimalId), [positions, selectedAnimalId]);
  const selectedAnimal = useMemo(() => recentAnimals.find((animal) => animal.id === selectedAnimalId), [recentAnimals, selectedAnimalId]);

  const handleRecenter = useCallback(() => {
    if (!farm) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude: farm.lat,
        longitude: farm.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      400
    );
  }, [farm]);

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
    if (createZone !== 'true') {
      setDraftPoints([]);
      setZoneName('');
      setNameModalVisible(false);
    }
  }, [createZone]);

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

  if (farmLoading || positionsLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (farmError || positionsError || !farm) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Unable to load map</ThemedText>
        <Pressable style={styles.retryButton} onPress={() => handleRefresh()}>
          <ThemedText type="smallBold">Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const isDraftMode = Boolean(editZoneId || createZone === 'true');
  const canSaveCreate = draftPoints.length >= 3;

  if (Platform.OS === 'web') {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.webFallback}>
          <ThemedText type="title">Map is not available in web preview</ThemedText>
          <ThemedText type="subtitle">Please open this screen in a native device or simulator.</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
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

          const nearestIndex = draftPoints.reduce((bestIndex, point, index) => {
            const bestDistance = draftPoints[bestIndex] ? Math.hypot(point.lat - target.lat, point.lng - target.lng) : Number.POSITIVE_INFINITY;
            const currentDistance = Math.hypot(point.lat - target.lat, point.lng - target.lng);
            return currentDistance < bestDistance ? index : bestIndex;
          }, 0);

          const nextIndex = (nearestIndex + 1) % draftPoints.length;
          const insertIndex = Math.min(nearestIndex, nextIndex) + 1;
          const inserted = [...draftPoints];
          inserted.splice(insertIndex, 0, target);
          setDraftPoints(inserted);
        }}
      >
        {zones.filter((zone) => zone.active).map((zone) => (
          <View key={zone.id}>
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
          </View>
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

        {positions?.map((position) => (
          <AnimalMarker key={position.animalId} position={position} onPress={() => setSelectedAnimalId(position.animalId)} />
        ))}
        {selectedPosition && selectedAnimal ? (
          <Marker coordinate={{ latitude: selectedPosition.lat, longitude: selectedPosition.lng }} anchor={{ x: 0.5, y: 1 }}>
            <AnimalCallout animal={selectedAnimal} position={selectedPosition} />
          </Marker>
        ) : null}
      </MapView>

      <FarmHeaderPill name={farm.name} onlineCount={farm.onlineCount} totalCount={farm.totalCount} />

      <View style={styles.actionStack}>
        <MapActionButton icon="crosshair" onPress={handleRecenter} />
        <MapActionButton icon="refresh" onPress={handleRefresh} />
        <MapActionButton icon="fence" onPress={() => router.push('/zones' as never)} />
      </View>

      {isDraftMode ? (
        <View style={styles.draftActions}>
          {createZone === 'true' ? (
            <>
              <Pressable
                style={[styles.actionButton, draftPoints.length === 0 && styles.actionButtonDisabled]}
                disabled={draftPoints.length === 0}
                onPress={() => setDraftPoints((current) => current.slice(0, -1))}
              >
                <ThemedText type="smallBold" style={styles.actionButtonText}>Undo last point</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.actionButton, !canSaveCreate && styles.actionButtonDisabled]}
                disabled={!canSaveCreate || createZoneMutation.isPending}
                onPress={() => setNameModalVisible(true)}
              >
                <ThemedText type="smallBold" style={styles.actionButtonText}>
                  {createZoneMutation.isPending ? 'Saving…' : 'Name & Save'}
                </ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={styles.actionButton} onPress={handleCancelDraft}>
                <ThemedText type="smallBold" style={styles.actionButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.actionButton, updateZoneShapeMutation.isPending && styles.actionButtonDisabled]}
                disabled={updateZoneShapeMutation.isPending}
                onPress={handleSaveEdit}
              >
                <ThemedText type="smallBold" style={styles.actionButtonText}>
                  {updateZoneShapeMutation.isPending ? 'Saving…' : 'Save'}
                </ThemedText>
              </Pressable>
            </>
          )}
          {createZone === 'true' ? (
            <Pressable style={styles.actionButton} onPress={handleCancelDraft}>
              <ThemedText type="smallBold" style={styles.actionButtonText}>Cancel</ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Modal visible={nameModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText type="subtitle">Name this zone</ThemedText>
            <TextInput
              value={zoneName}
              onChangeText={setZoneName}
              placeholder="Zone name"
              style={styles.input}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={() => setNameModalVisible(false)}>
                <ThemedText type="smallBold">Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary, !zoneName.trim() && styles.actionButtonDisabled]}
                disabled={!zoneName.trim() || createZoneMutation.isPending}
                onPress={() => {
                  setNameModalVisible(false);
                  handleSaveCreate();
                }}
              >
                <ThemedText type="smallBold" style={styles.actionButtonText}>
                  {createZoneMutation.isPending ? 'Saving…' : 'Save'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <AllAnimalsSheet animals={recentAnimals} onSelect={handleSelectAnimal} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  actionStack: {
    position: 'absolute',
    right: 16,
    top: 96,
    zIndex: 3,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  editActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 110,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  draftActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 104,
    zIndex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#FFFFFF',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  modalButtonPrimary: {
    backgroundColor: '#111827',
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
