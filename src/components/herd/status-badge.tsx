import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { StatusColors, StatusLabels } from '@/constants/theme';
import type { AnimalStatus } from '@/types/animal';

type StatusBadgeProps = {
  status: AnimalStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${StatusColors[status]}33` }]}>
      <ThemedText type="smallBold" style={[styles.text, { color: StatusColors[status] }]}> 
        {StatusLabels[status]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  text: {
    letterSpacing: 0.5,
  },
});
