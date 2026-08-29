import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Animal, AnimalPosition } from '@/types/animal';
import { formatRelativeTime } from '@/utils/format-time';

type AnimalCalloutProps = {
  animal: Animal;
  position: AnimalPosition;
};

export default function AnimalCallout({ animal, position }: AnimalCalloutProps) {
  const showWarning = position.status === 'alert' || position.status === 'lame';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" style={styles.name}>{animal.name}</ThemedText>
        {showWarning ? <ThemedText type="smallBold" style={styles.warning}>⚠</ThemedText> : null}
      </View>
      <ThemedText type="small" style={styles.status}>
        {position.status === 'alert' ? 'Needs attention' : 'Active and moving'}
      </ThemedText>
      <ThemedText type="small" style={styles.time}>{formatRelativeTime(position.updatedAt)}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(17,24,39,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 180,
    gap: 4,
  },
  // The callout sits on a pinned-dark card over satellite imagery, so its text
  // colors are fixed rather than themed - theme.text would be black in light mode.
  name: {
    color: '#FFFFFF',
  },
  status: {
    color: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  warning: {
    color: '#F97316',
  },
  time: {
    color: '#9CA3AF',
  },
});
