import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import ScreenHeader from '@/components/layout/screen-header';
import SectionHeader from '@/components/settings/section-header';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fab } from '@/components/ui/fab';
import { QueryBoundary } from '@/components/ui/states';
import DangerZoneRow from '@/components/zones/danger-zone-row';
import ZoneCard from '@/components/zones/zone-card';
import { Space } from '@/constants/theme';
import { useToggleZone } from '@/hooks/mutations/use-toggle-zone';
import { useDangerZones } from '@/hooks/queries/use-danger-zones';
import { useZones } from '@/hooks/queries/use-zones';

export default function ZonesScreen() {
  const router = useRouter();
  const {
    data: zones = [],
    isLoading: zonesLoading,
    isError: zonesError,
    refetch: refetchZones,
  } = useZones();
  const {
    data: dangerZones = [],
    isLoading: dangerLoading,
    isError: dangerError,
    refetch: refetchDanger,
  } = useDangerZones();
  const toggleZoneMutation = useToggleZone();

  return (
    <ScreenContainer
      scroll
      hasFab
      edges={['top', 'bottom']}
      contentContainerStyle={styles.content}
      header={<ScreenHeader title="Virtual Fences" back />}
      floating={
        <Fab
          icon="plus"
          onPress={() => router.push('/(tabs)/map?createZone=true')}
          accessibilityLabel="Draw new fence"
        />
      }
    >
      <SectionHeader title="Active Zones" />

      <Button
        fullWidth
        label="Draw New Fence on Map"
        onPress={() => router.push('/(tabs)/map?createZone=true')}
      />

      <QueryBoundary
        isLoading={zonesLoading}
        isError={zonesError}
        isEmpty={!zones.length}
        onRetry={refetchZones}
        error={{ description: 'Unable to load zones.' }}
        empty={{ title: 'No zones yet', description: 'Draw your first fence on the map.' }}
      >
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            onEdit={() => router.push(`/(tabs)/map?editZoneId=${zone.id}`)}
            onToggle={(active) => toggleZoneMutation.mutate({ id: zone.id, active })}
          />
        ))}
      </QueryBoundary>

      <SectionHeader title="Danger Zones" />

      <QueryBoundary
        isLoading={dangerLoading}
        isError={dangerError}
        isEmpty={!dangerZones.length}
        onRetry={refetchDanger}
        error={{ description: 'Unable to load danger zones.' }}
        empty={{ title: 'No danger zones listed' }}
      >
        {dangerZones.map((zone) => (
          <DangerZoneRow
            key={zone.id}
            zone={zone}
            onPress={() => router.push(`/(tabs)/map?focusZoneId=${zone.id}`)}
          />
        ))}
      </QueryBoundary>

      <Card variant="tinted" tone="brand" style={styles.tip}>
        <ThemedText type="small">
          Draw your fence at least 50 meters from any road or railway line to avoid bad paddock warnings.
        </ThemedText>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.md,
  },
  tip: {
    marginTop: Space.sm,
  },
});
