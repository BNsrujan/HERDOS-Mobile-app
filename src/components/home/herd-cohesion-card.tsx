import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { HerdCohesion } from '@/types/analytics';

type HerdCohesionCardProps = {
  cohesion: HerdCohesion;
  onPress: () => void;
};

/**
 * Herd spread at a glance.
 *
 * The scatter is a plain View plot, not a map: this is about RELATIVE spread, and
 * stripping the basemap is what makes an outlier unmissable.
 */
export default function HerdCohesionCard({ cohesion, onPress }: HerdCohesionCardProps) {
  const theme = useTheme();
  const animals = cohesion.animals ?? [];

  // Anything beyond 3x the median is what the isolation detector considers far.
  const farLimit = Math.max(cohesion.medianDistanceMeters * 3, 1);
  const outliers = animals.filter((a) => a.distanceMeters > farLimit);
  const together = animals.length - outliers.length;

  return (
    <Card variant="elevated" radius="xl" onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="heading">Herd together</ThemedText>
        <Icon name="chevron-right" size={18} />
      </View>

      {!cohesion.reliable ? (
        // With too few collars reporting, a centroid is arithmetic on noise.
        <ThemedText type="small" themeColor="textSecondary">
          Only {cohesion.reportingCount} of {cohesion.totalCount} collars reporting — not enough to
          judge herd spread.
        </ThemedText>
      ) : (
        <>
          <Scatter animals={animals} outlierIds={outliers.map((o) => o.animalId)} />

          <View style={styles.summaryRow}>
            <ThemedText type="small">
              {together} of {cohesion.totalCount} together
            </ThemedText>
            <Badge
              label={`${cohesion.spreadMeters} m spread`}
              tone={outliers.length ? 'warning' : 'success'}
            />
          </View>

          {outliers.length ? (
            <View style={styles.outlierBlock}>
              {outliers.slice(0, 2).map((o) => (
                <ThemedText key={o.animalId} type="caption" themeColor="onWarningSubtle">
                  {o.animalName} is {o.distanceMeters} m from the herd
                </ThemedText>
              ))}
            </View>
          ) : (
            <ThemedText type="caption" themeColor="textSecondary">
              Everyone within {Math.round(farLimit)} m of the group.
            </ThemedText>
          )}
        </>
      )}
    </Card>
  );
}

/** Normalised scatter of the herd around its centroid. */
function Scatter({ animals, outlierIds }: { animals: HerdCohesion['animals']; outlierIds: string[] }) {
  const theme = useTheme();
  const list = animals ?? [];
  if (list.length < 2) return null;

  const lats = list.map((a) => a.lat);
  const lngs = list.map((a) => a.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat || 1e-6;
  const spanLng = maxLng - minLng || 1e-6;

  const outlierSet = new Set(outlierIds);

  return (
    <View style={[styles.scatter, { backgroundColor: theme.surfaceSunken }]}>
      {list.map((a) => {
        const isOutlier = outlierSet.has(a.animalId);
        return (
          <View
            key={a.animalId}
            style={[
              styles.point,
              {
                // Latitude increases upward, so invert for screen coordinates.
                top: `${(1 - (a.lat - minLat) / spanLat) * 100}%` as `${number}%`,
                left: `${((a.lng - minLng) / spanLng) * 100}%` as `${number}%`,
                backgroundColor: isOutlier ? theme.warning : theme.brand,
                width: isOutlier ? 12 : 8,
                height: isOutlier ? 12 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Space.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scatter: {
    height: 90,
    borderRadius: Radius.md,
    padding: Space.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  point: {
    position: 'absolute',
    borderRadius: Radius.full,
    marginLeft: -4,
    marginTop: -4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
  outlierBlock: {
    gap: 2,
  },
});
