import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { Animal, AnimalPosition } from '@/types/animal';
import { formatRelativeTime } from '@/utils/format-time';

// Fixed rather than themed: the callout is a pinned-dark card over satellite imagery.
const WARNING_COLOR = '#F97316';

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
        {showWarning ? <TriangleAlert size={14} color={WARNING_COLOR} strokeWidth={2.25} /> : null}
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
  time: {
    color: '#9CA3AF',
  },
});
