import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import DangerZoneRow from '@/components/zones/danger-zone-row';
import ZoneCard from '@/components/zones/zone-card';
import { useToggleZone } from '@/hooks/mutations/use-toggle-zone';
import { useDangerZones } from '@/hooks/queries/use-danger-zones';
import { useZones } from '@/hooks/queries/use-zones';

export default function ZonesScreen() {
  const router = useRouter();
  const { data: zones = [], isLoading: zonesLoading, isError: zonesError } = useZones();
  const { data: dangerZones = [], isLoading: dangerLoading, isError: dangerError } = useDangerZones();
  const toggleZoneMutation = useToggleZone();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Virtual Fences</ThemedText>

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Active Zones</ThemedText>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/map?createZone=true')}>
          <ThemedText type="smallBold" style={styles.primaryButtonText}>Draw New Fence on Map</ThemedText>
        </Pressable>

        {zonesLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#22C55E" />
          </View>
        ) : zonesError ? (
          <View style={styles.centered}>
            <ThemedText type="small">Unable to load zones.</ThemedText>
          </View>
        ) : !zones.length ? (
          <View style={styles.emptyState}>
            <ThemedText type="small">No zones available yet.</ThemedText>
          </View>
        ) : (
          zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              onEdit={() => router.push(`/(tabs)/map?editZoneId=${zone.id}`)}
              onToggle={(active) => toggleZoneMutation.mutate({ id: zone.id, active })}
            />
          ))
        )}

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Danger Zones</ThemedText>
        </View>

        {dangerLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#EF4444" />
          </View>
        ) : dangerError ? (
          <View style={styles.centered}>
            <ThemedText type="small">Unable to load danger zones.</ThemedText>
          </View>
        ) : !dangerZones.length ? (
          <View style={styles.emptyState}>
            <ThemedText type="small">No danger zones listed.</ThemedText>
          </View>
        ) : (
          dangerZones.map((zone) => (
            <DangerZoneRow
              key={zone.id}
              zone={zone}
              onPress={() => router.push(`/(tabs)/map?focusZoneId=${zone.id}`)}
            />
          ))
        )}

        <View style={styles.tipBanner}>
          <ThemedText type="small">
            Draw your fence at least 50 meters from any road or railway line to avoid bad paddock warnings.
          </ThemedText>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/(tabs)/map?createZone=true')}>
        <ThemedText type="smallBold" style={styles.fabText}>+</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 96,
    gap: 12,
  },
  sectionHeader: {
    marginTop: 8,
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
  },
  centered: {
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
  },
  tipBanner: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
  },
});
