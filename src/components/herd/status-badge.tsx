import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { StatusColors } from '@/constants/theme';
import type { AnimalStatus } from '@/types/animal';

type StatusBadgeProps = {
  status: AnimalStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: StatusColors[status] }]}> 
      <ThemedText type="smallBold" style={styles.text}>
        {status}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
  },
});
