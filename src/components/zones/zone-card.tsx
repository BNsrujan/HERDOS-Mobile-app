import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { FenceZone } from '@/types/zone';

type ZoneCardProps = {
  zone: FenceZone;
  onEdit: () => void;
  onToggle: (active: boolean) => void;
};

export default function ZoneCard({ zone, onEdit, onToggle }: ZoneCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.swatch, { backgroundColor: zone.active ? '#22C55E' : '#9CA3AF' }]} />
        <View style={styles.textBlock}>
          <ThemedText type="smallBold">{zone.name}</ThemedText>
          <ThemedText type="small" style={styles.metaText}>
            {zone.animalCount} animals inside
          </ThemedText>
        </View>
        <View style={[styles.pill, zone.active ? styles.activePill : styles.pausedPill]}>
          <ThemedText type="smallBold" style={zone.active ? styles.activeText : styles.pausedText}>
            {zone.active ? 'ACTIVE' : 'PAUSED'}
          </ThemedText>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <ThemedText type="smallBold">✎</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <Switch value={zone.active} onValueChange={onToggle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    gap: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  textBlock: {
    flex: 1,
  },
  metaText: {
    color: '#6B7280',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activePill: {
    backgroundColor: '#DCFCE7',
  },
  pausedPill: {
    backgroundColor: '#E5E7EB',
  },
  activeText: {
    color: '#166534',
  },
  pausedText: {
    color: '#4B5563',
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    alignItems: 'flex-end',
  },
});
