import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { HerdAlert } from '@/types/alert';

type CriticalAlertBannerProps = {
  alert?: HerdAlert;
};

export default function CriticalAlertBanner({ alert }: CriticalAlertBannerProps) {
  if (!alert) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <ThemedText type="smallBold" style={styles.title}>
        Critical panic alert
      </ThemedText>
      <ThemedText type="small" style={styles.text}>
        {alert.animalName} • {alert.message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  title: {
    color: '#B91C1C',
    marginBottom: 4,
  },
  text: {
    color: '#7F1D1D',
  },
});
