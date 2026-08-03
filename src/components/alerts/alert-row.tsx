import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import AlertIcon from '@/components/alerts/alert-icon';
import type { HerdAlert } from '@/types/alert';

type AlertRowProps = {
  alert: HerdAlert;
};

export default function AlertRow({ alert }: AlertRowProps) {
  return (
    <View style={styles.container}>
      <AlertIcon severity={alert.severity} />
      <View style={styles.textContainer}>
        <ThemedText type="subtitle">{alert.title}</ThemedText>
        <ThemedText type="small">{alert.description}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
