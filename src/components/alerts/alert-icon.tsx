import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { AlertSeverity } from '@/types/alert';

const severityColors: Record<AlertSeverity, string> = {
  low: '#F5A524',
  medium: '#EF4444',
  high: '#991B1B',
};

type AlertIconProps = {
  severity: AlertSeverity;
};

export default function AlertIcon({ severity }: AlertIconProps) {
  return (
    <View style={[styles.container, { backgroundColor: severityColors[severity] }]}> 
      <ThemedText type="smallBold" style={styles.text}>
        {severity}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
