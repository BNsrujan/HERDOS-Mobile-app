import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { Region } from 'react-native-maps';

// Load react-native-maps only on native platforms to avoid web build-time errors
let MapView: any;
let Marker: any;
let Polygon: any;
let Polyline: any;
let Heatmap: any;
if (Platform.OS !== 'web') {
  // require at runtime so web bundlers won't evaluate native modules
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default || RNMaps;
  Marker = RNMaps.Marker;
  Polygon = RNMaps.Polygon;
  Polyline = RNMaps.Polyline;
  Heatmap = RNMaps.Heatmap;
}

import ScreenContainer from '@/components/layout/screen-container';
import BrowseSheetContent from '@/components/map/browse-sheet-content';
import AnimalCallout from '@/components/map/animal-callout';
import AnimalMarker from '@/components/map/animal-marker';
import DraftToolbar from '@/components/map/draft-toolbar';
import MapContextBar from '@/components/map/map-context-bar';
import MapActionButton from '@/components/map/map-action-button';
import LayersSheet, { type LayersSheetHandle } from '@/components/map/layers-sheet';
import MapControlRail from '@/components/map/map-control-rail';
import MapSheet, { type MapSheetHandle } from '@/components/map/map-sheet';
import ZoneNameSheet, { type ZoneNameSheetHandle } from '@/components/map/zone-name-sheet';
import TrailSheetContent from '@/components/map/trail-sheet-content';
import CoverageGrid from '@/components/map/coverage-grid';
import LayerLegend from '@/components/map/layer-legend';
import type { MapDataLayer, MapType, PlaybackSpeed, TrailRange } from '@/types/map';
import RestSpotMarker from '@/components/map/rest-spot-marker';
import TrailEndpointMarker from '@/components/map/trail-endpoint-marker';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/states';
import { MAP_PROVIDER, SUPPORTS_HEATMAP } from '@/constants/maps';
import { BROWSE_SNAPS, TRAIL_SNAPS, useMapChromeInsets } from '@/constants/map-layout';
import { SUPPORTS_HEATMAP as HEATMAP_OK } from '@/constants/maps';
import { Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCreateZone } from '@/hooks/mutations/use-create-zone';
import { useUpdateZoneShape } from '@/hooks/mutations/use-update-zone-shape';
import { useAnimalPositions } from '@/hooks/queries/use-animal-positions';
import { useFarm } from '@/hooks/queries/use-farm';
import { useRecentAnimals } from '@/hooks/queries/use-recent-animals';
import { useMapType } from '@/hooks/use-map-type';
import { useAnimalTrack } from '@/hooks/queries/use-animal-track';
import { useGrazingHeatmap } from '@/hooks/queries/use-grazing-heatmap';
import { useHomeRange } from '@/hooks/queries/use-home-range';
import { useLoraCoverage } from '@/hooks/queries/use-lora-coverage';
import { useRestSpots } from '@/hooks/queries/use-rest-spots';
import { useZones } from '@/hooks/queries/use-zones';
import type { Animal } from '@/types/animal';
import type { GeofencePoint } from '@/types/zone';
import { activityColor, toActivitySegments } from '@/utils/track-display';

// Used when /farm is unavailable so the map still renders. Matches the seeded farm.
const FALLBACK_FARM_CENTER = { lat: 13.4168, lng: 75.2588 };

const VALID_LAYERS = ['live', 'trail', 'graze', 'range', 'signal'] as const;
type LegacyLayer = (typeof VALID_LAYERS)[number];

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
  const zoneNameSheetRef = useRef<ZoneNameSheetHandle>(null);
  const [zoneName, setZoneName] = useState('');

  // ---- Trail layer -------------------------------------------------------
  const [layer, setLayer] = useState<LegacyLayer>(
    VALID_LAYERS.includes(layerParam as LegacyLayer) ? (layerParam as LegacyLayer) : 'live',
  );
  const isDraftMode = Boolean(editZoneId || createZone === 'true');

  // A zone draft and the trail console are both zIndex 5, and the draft is declared
  // first, so together they hide the draft's own Cancel/Save and it becomes
  // impossible to exit. Draft wins; the trail layer stands down. Derived here rather
  // than at render time so the trail query does not fire for a layer we will not show.
  const effectiveLayer: LegacyLayer = isDraftMode && layer === 'trail' ? 'live' : layer;

  const chrome = useMapChromeInsets();
  const sheetRef = useRef<MapSheetHandle>(null);
  const layersSheetRef = useRef<LayersSheetHandle>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapAreaHeight, setMapAreaHeight] = useState(0);
  const [trailPrompt, setTrailPrompt] = useState<string | undefined>();
  const { mapType, setMapType } = useMapType();
  const sheetPosition = useSharedValue(0);
  const [sheetIndex, setSheetIndex] = useState(0);

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
    effectiveLayer === 'trail',
  );

  // Each layer fetches only while it is the visible one.
  const { data: restSpots } = useRestSpots(selectedAnimalId ?? undefined, 7, effectiveLayer === 'trail');
  const { data: heatmap } = useGrazingHeatmap({}, effectiveLayer === 'graze' && SUPPORTS_HEATMAP);
  const { data: homeRange } = useHomeRange(selectedAnimalId ?? undefined, '30d', effectiveLayer === 'range');
  const { data: coverage } = useLoraCoverage(effectiveLayer === 'signal');

  // The legend lives inside the sheet now, not as a floating card. That removes the
  // 361x76 transparent overlay that used to sit between the rail and the map.
  const activeLegend = useMemo(() => {
    if (effectiveLayer === 'graze' && heatmap) {
      return {
        title: 'Grazing density',
        detail: `${heatmap.totalCells} patches · ${heatmap.from === heatmap.to ? 'today' : `${heatmap.from} to ${heatmap.to}`}`,
        entries: [
          { color: '#22C55E', label: 'less' },
          { color: '#EAB308', label: 'more' },
          { color: '#EF4444', label: 'most' },
        ],
      };
    }
    if (effectiveLayer === 'range' && homeRange) {
      return {
        title: 'Home range',
        detail: `${homeRange.areaHectares} ha used · ${homeRange.coreAreaHectares} ha core`,
        entries: [
          { color: 'rgba(37,99,235,0.35)', label: 'full range' },
          { color: 'rgba(37,99,235,0.8)', label: 'core 50%' },
        ],
      };
    }
    if (effectiveLayer === 'signal' && coverage) {
      return {
        title: 'LoRa coverage',
        detail: `${coverage.cells.length} cells · ${coverage.cellMeters}m grid`,
        entries: [
          { color: 'rgba(34,197,94,0.8)', label: `good ≥${coverage.gradeThresholds.good}` },
          { color: 'rgba(245,158,11,0.8)', label: `fair ≥${coverage.gradeThresholds.fair}` },
          { color: 'rgba(239,68,68,0.8)', label: 'weak' },
        ],
      };
    }
    return null;
  }, [effectiveLayer, heatmap, homeRange, coverage]);

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
    if (effectiveLayer !== 'trail' || !track?.points.length || !mapRef.current) return;

    mapRef.current.fitToCoordinates(
      track.points.map((p) => ({ latitude: p.lat, longitude: p.lng })),
      { edgePadding: { top: 120, right: 60, bottom: 320, left: 60 }, animated: true },
    );
  }, [effectiveLayer, track]);

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
      setTrailPrompt(undefined);
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
    // Without clearing these the (tabs) route entry keeps ?createZone=true, so
    // re-selecting the Map tab later drops straight back into draft mode.
    router.setParams({ createZone: undefined, editZoneId: undefined });
    router.replace('/zones');
  }, [router]);

  const handleSaveEdit = useCallback(() => {
    if (!editZoneId || !draftPoints.length) {
      return;
    }

    updateZoneShapeMutation.mutate(
      { id: editZoneId, points: draftPoints },
      {
        onSuccess: () => {
          router.setParams({ createZone: undefined, editZoneId: undefined });
          router.replace('/zones');
        },
      },
    );
  }, [draftPoints, editZoneId, router, updateZoneShapeMutation]);

  const handleSaveCreate = useCallback(() => {
    if (draftPoints.length < 3 || !zoneName.trim()) {
      return;
    }

    createZoneMutation.mutate(
      { name: zoneName.trim(), points: draftPoints },
      {
        onSuccess: () => {
          router.setParams({ createZone: undefined, editZoneId: undefined });
          router.replace('/zones');
        },
      },
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
      zoneNameSheetRef.current?.dismiss();
    }
  }, [createZone, editZoneId]);

  // Apply ?layer= once, then clear it. Reading it in a useState initializer meant
  // deep links were ignored on an already-mounted tab; clearing it is what makes
  // re-application idempotent.
  useEffect(() => {
    if (!layerParam) return;

    if (VALID_LAYERS.includes(layerParam as LegacyLayer)) {
      setLayer(layerParam as LegacyLayer);
    }
    router.setParams({ layer: undefined });
  }, [layerParam, router]);

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
    // Consume the param: this effect depends on `positions`, which refetches on a
    // 30s staleTime, so without clearing it the camera snaps back every refetch and
    // undoes the user's pan.
    router.setParams({ focusAnimalId: undefined });
    mapRef.current?.animateToRegion(
      {
        latitude: targetPosition.lat,
        longitude: targetPosition.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      400,
    );
  }, [focusAnimalId, positions, router]);

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

    router.setParams({ focusZoneId: undefined });
    mapRef.current?.animateToRegion(
      {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.02),
        longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.02),
      },
      400,
    );
  }, [focusZoneId, zones, router]);

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
    <View
      style={styles.container}
      onLayout={(event) => setMapAreaHeight(event.nativeEvent.layout.height)}
    >
      <StatusBar style="light" />
      <MapView
        ref={mapRef}
        provider={MAP_PROVIDER}
        style={styles.map}
        mapType={mapType}
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
        {effectiveLayer === 'trail' && trailSegments.map((segment, index) => (
          <Polyline
            key={`trail-${index}`}
            coordinates={segment.points.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
            strokeColor={activityColor(segment.activity)}
            strokeWidth={5}
            zIndex={2}
          />
        ))}

        {effectiveLayer === 'trail' && track && track.points.length > 1 ? (
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

        {/* Rest spots ride inside the trail rather than hiding behind another
            toggle: where the animal stopped is part of where it went. */}
        {effectiveLayer === 'trail' && restSpots?.spots.map((spot) => (
          <RestSpotMarker key={spot.id} spot={spot} />
        ))}

        {effectiveLayer === 'graze' && SUPPORTS_HEATMAP && heatmap && heatmap.points.length > 0 ? (
          <Heatmap
            points={heatmap.points.map((p) => ({
              latitude: p.lat,
              longitude: p.lng,
              weight: p.weight,
            }))}
            radius={40}
            opacity={0.75}
            gradient={{
              colors: ['#22C55E', '#EAB308', '#EF4444'],
              startPoints: [0.15, 0.5, 1],
              colorMapSize: 256,
            }}
          />
        ) : null}

        {effectiveLayer === 'range' && homeRange && homeRange.hull.length >= 3 ? (
          <>
            <Polygon
              coordinates={homeRange.hull.map((p) => ({ latitude: p.lat, longitude: p.lng }))}
              strokeColor="#2563EB"
              fillColor="rgba(37,99,235,0.12)"
              strokeWidth={2}
              tappable={false}
            />
            {/* The darker core shows where it ACTUALLY spends time, as opposed to
                the full extent of where it can roam. */}
            {homeRange.coreCells.map((cell, index) => (
              <Marker
                key={`core-${index}`}
                coordinate={{ latitude: cell.lat, longitude: cell.lng }}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View style={styles.coreCell} />
              </Marker>
            ))}
          </>
        ) : null}

        {effectiveLayer === 'signal' && coverage ? <CoverageGrid coverage={coverage} /> : null}

        {/* Live markers are the base layer; hidden while a trail is on screen so
            the path stays readable. */}
        {effectiveLayer !== 'trail' && positions?.map((position) => (
          <AnimalMarker key={position.animalId} position={position} onPress={() => setSelectedAnimalId(position.animalId)} />
        ))}
        {effectiveLayer !== 'trail' && selectedPosition && selectedAnimal ? (
          <Marker coordinate={{ latitude: selectedPosition.lat, longitude: selectedPosition.lng }} anchor={{ x: 0.5, y: 1 }}>
            <AnimalCallout animal={selectedAnimal} position={selectedPosition} />
          </Marker>
        ) : null}
      </MapView>

      {isDraftMode ? (
        <MapContextBar
          title={editZoneId ? 'Editing fence' : 'New fence'}
          subtitle={`${draftPoints.length} ${draftPoints.length === 1 ? 'point' : 'points'}`}
          onExit={handleCancelDraft}
          exitLabel="Cancel drawing"
          exitIcon="close"
        />
      ) : effectiveLayer === 'trail' ? (
        <MapContextBar
          title={track?.animalName ?? selectedAnimal?.name ?? 'Trail'}
          subtitle={trailRange === '7d' ? 'Last 7 days' : trailRange === 'yesterday' ? 'Yesterday' : 'Today'}
          onExit={closeTrail}
          exitLabel="Close trail"
        />
      ) : farm ? (
        <MapContextBar
          title={farm.name}
          subtitle={`${farm.onlineCount}/${farm.totalCount} online`}
          showStatusDot
        />
      ) : null}

      {mapAreaHeight > 0 ? (
      <MapControlRail
        items={
          isDraftMode
            ? [{ icon: 'crosshair', onPress: handleRecenter, accessibilityLabel: 'Recenter map' }]
            : [
                {
                  icon: 'layers',
                  onPress: () => {
                    setLayersOpen(true);
                    layersSheetRef.current?.present();
                  },
                  accessibilityLabel: 'Map layers',
                  active: layersOpen,
                },
                { icon: 'crosshair', onPress: handleRecenter, accessibilityLabel: 'Recenter map' },
                { icon: 'refresh', onPress: handleRefresh, accessibilityLabel: 'Refresh positions' },
                { icon: 'fence', onPress: () => router.push('/zones'), accessibilityLabel: 'Manage fences' },
              ]
        }
        sheetPosition={sheetPosition}
        containerHeight={mapAreaHeight - chrome.sheetTopInset}
        contextTop={chrome.contextTop}
        interactive={sheetIndex === 0}
      />
      ) : null}

      {isDraftMode ? (
        <DraftToolbar
          op={editZoneId ? 'edit' : 'create'}
          pointCount={draftPoints.length}
          canSave={editZoneId ? draftPoints.length >= 3 : canSaveCreate}
          saving={createZoneMutation.isPending || updateZoneShapeMutation.isPending}
          onUndo={() => setDraftPoints((current) => current.slice(0, -1))}
          onCancel={handleCancelDraft}
          onSave={() => {
            if (editZoneId) handleSaveEdit();
            else zoneNameSheetRef.current?.present();
          }}
        />
      ) : null}

      <LayersSheet
        ref={layersSheetRef}
        layer={(effectiveLayer === 'trail' ? 'live' : effectiveLayer) as MapDataLayer}
        mapType={mapType}
        trailActive={effectiveLayer === 'trail'}
        onSelectLayer={(next) => setLayer(next)}
        onSelectTrail={() => {
          const subject = selectedAnimalId ?? recentAnimals[0]?.id ?? null;
          if (subject) {
            setSelectedAnimalId(subject);
            setTrailPrompt(undefined);
            setLayer('trail');
            return;
          }
          // No candidate: stay in browse, open the picker and say why, rather than
          // rendering an empty trail with nothing to choose from.
          setTrailPrompt('Pick an animal to see its trail');
          sheetRef.current?.snapToIndex(1);
        }}
        onSelectMapType={setMapType}
        onDismiss={() => setLayersOpen(false)}
      />

      <ZoneNameSheet
        ref={zoneNameSheetRef}
        value={zoneName}
        onChange={setZoneName}
        saving={createZoneMutation.isPending}
        onSave={() => {
          zoneNameSheetRef.current?.dismiss();
          handleSaveCreate();
        }}
      />

      {effectiveLayer === 'trail' ? (
        <MapSheet
          ref={sheetRef}
          snapPoints={TRAIL_SNAPS}
          topInset={chrome.sheetTopInset}
          animatedPosition={sheetPosition}
          onIndexChange={setSheetIndex}
          // The trail sheet hosts a Slider and a chip row and has no scrollable at
          // the lower detents, so content panning only fights them. Handle drag and
          // the tappable header still change detent.
          enableContentPanning={false}
        >
          {track ? (
            <TrailSheetContent
              track={track}
              range={trailRange}
              onRangeChange={setTrailRange}
              cursor={cursor}
              onCursorChange={setCursor}
              playing={playing}
              onTogglePlay={() => setPlaying((v) => !v)}
              speed={speed}
              onSpeedChange={setSpeed}
              detent={sheetIndex}
              onToggleDetent={() => sheetRef.current?.snapToIndex(sheetIndex > 0 ? 0 : 1)}
            />
          ) : (
            // Loading is sheet CONTENT now, not a transparent sibling overlay — so
            // there is nothing left to swallow map gestures while a trail fetches.
            <LoadingState size="sm" label="Loading trail" />
          )}
        </MapSheet>
      ) : (
        <MapSheet
          ref={sheetRef}
          snapPoints={BROWSE_SNAPS}
          topInset={chrome.sheetTopInset}
          animatedPosition={sheetPosition}
          onIndexChange={setSheetIndex}
        >
          <BrowseSheetContent
            animals={recentAnimals}
            detent={sheetIndex}
            selectedAnimalId={selectedAnimalId}
            onSelect={handleSelectAnimal}
            onToggleDetent={() => sheetRef.current?.snapToIndex(sheetIndex > 0 ? 0 : 1)}
            onlineCount={farm?.onlineCount ?? 0}
            totalCount={farm?.totalCount ?? recentAnimals.length}
            legend={activeLegend ? <LayerLegend {...activeLegend} compact /> : undefined}
            prompt={trailPrompt}
          />
        </MapSheet>
      )}
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
  coreCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: 'rgba(37,99,235,0.55)',
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
