import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polygon, type LatLng, type Region } from 'react-native-maps';

import AllAnimalsSheet from '@/components/map/all-animals-sheet';
import AnimalCallout from '@/components/map/animal-callout';
import AnimalMarker from '@/components/map/animal-marker';
import FarmHeaderPill from '@/components/map/farm-header-pill';
import MapActionButton from '@/components/map/map-action-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnimalPositions } from '@/hooks/queries/use-animal-positions';
import { useFarm } from '@/hooks/queries/use-farm';
import { useRecentAnimals } from '@/hooks/queries/use-recent-animals';
import { useUpdateGeofence } from '@/hooks/queries/use-update-geofence';
import type { GeofencePoint } from '@/services/api/farm';
import type { Animal } from '@/types/animal';

export default function MapScreen() {
  const queryClient = useQueryClient();
  const mapRef = useRef<MapView>(null);
  const { data: farm, isLoading: farmLoading, isError: farmError, refetch: refetchFarm } = useFarm();
  const { data: positions, isLoading: positionsLoading, isError: positionsError, refetch: refetchPositions } = useAnimalPositions();
  const { data: recentAnimals = [] } = useRecentAnimals(10);
  const { focusAnimalId } = useLocalSearchParams<{ focusAnimalId?: string }>();
  const updateGeofenceMutation = useUpdateGeofence();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [isEditingFence, setIsEditingFence] = useState(false);
  const [draftPoints, setDraftPoints] = useState<GeofencePoint[]>([]);
  const [sheetIndex, setSheetIndex] = useState(0);

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

  const handleStartEditingFence = useCallback(() => {
    if (!farm?.geofence?.length) {
      return;
    }

    setIsEditingFence(true);
    setSheetIndex(0);
    setDraftPoints(farm.geofence.map((point) => ({ ...point })));
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditingFence(false);
    setDraftPoints([]);
    setSheetIndex(0);
  }, []);

  const handleSaveFence = useCallback(() => {
    if (!draftPoints.length) {
      return;
    }

    updateGeofenceMutation.mutate(draftPoints, {
      onSuccess: () => {
        setIsEditingFence(false);
        setDraftPoints([]);
        setSheetIndex(0);
      },
    });
  }, [draftPoints, updateGeofenceMutation]);

  const handleVertexDrag = useCallback((index: number, coordinate: LatLng) => {
    setDraftPoints((current) => current.map((point, pointIndex) => (pointIndex === index ? { lat: coordinate.latitude, lng: coordinate.longitude } : point)));
  }, []);

  const handleMapLongPress = useCallback((event: { nativeEvent: { coordinate: LatLng } }) => {
    if (!isEditingFence || draftPoints.length < 3) {
      return;
    }

    const { coordinate } = event.nativeEvent;
    const target = { lat: coordinate.latitude, lng: coordinate.longitude };
    const distances = draftPoints.map((point) => Math.hypot(point.lat - target.lat, point.lng - target.lng));
    const nearestIndex = distances.indexOf(Math.min(...distances));
    const nextIndex = (nearestIndex + 1) % draftPoints.length;
    const insertIndex = Math.min(nearestIndex, nextIndex) + 1;
    const inserted = [...draftPoints];
    inserted.splice(insertIndex, 0, target);
    setDraftPoints(inserted);
  }, [draftPoints, isEditingFence]);

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

  useEffect(() => {
    if (!selectedAnimalId && positions?.length) {
      setSelectedAnimalId(positions[0].animalId);
    }
  }, [positions, selectedAnimalId]);

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

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.map}
        mapType="satellite"
        initialRegion={initialRegion}
        onLongPress={handleMapLongPress}
      >
        {draftPoints.length ? (
          <Polygon
            coordinates={draftPoints.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
            strokeColor="#14B8A6"
            fillColor="rgba(20,184,166,0.2)"
            strokeWidth={2}
          />
        ) : farm.geofence?.length ? (
          <Polygon
            coordinates={farm.geofence.map((point) => ({ latitude: point.lat, longitude: point.lng }))}
            strokeColor="#14B8A6"
            fillColor="rgba(20,184,166,0.2)"
            strokeWidth={2}
          />
        ) : null}
        {(isEditingFence ? draftPoints : farm.geofence)?.map((point, index) => (
          <Marker
            key={`${isEditingFence ? 'draft' : 'vertex'}-${index}`}
            coordinate={{ latitude: point.lat, longitude: point.lng }}
            draggable={isEditingFence}
            onDragEnd={(event) => handleVertexDrag(index, event.nativeEvent.coordinate)}
          >
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
        <MapActionButton icon="pencil" onPress={handleStartEditingFence} />
      </View>

      {isEditingFence ? (
        <View style={styles.editActions}>
          <Pressable style={styles.actionButton} onPress={handleSaveFence}>
            <ThemedText type="smallBold" style={styles.actionButtonText}>Save</ThemedText>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={handleCancelEdit}>
            <ThemedText type="smallBold" style={styles.actionButtonText}>Cancel</ThemedText>
          </Pressable>
        </View>
      ) : null}

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
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  actionButtonText: {
    color: '#FFFFFF',
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
