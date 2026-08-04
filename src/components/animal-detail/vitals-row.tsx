import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type VitalsRowProps = {
  bodyTempC: number;
  activityPercent: number;
  ruminationHours: number;
};

export default function VitalsRow({ bodyTempC, activityPercent, ruminationHours }: VitalsRowProps) {
  const items = [
    { label: 'Body temp', value: `${bodyTempC.toFixed(1)}°C` },
    { label: 'Activity', value: `${activityPercent}%` },
    { label: 'Rumination', value: `${ruminationHours.toFixed(1)}h` },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <ThemedText type="small" style={styles.label}>
            {item.label}
          </ThemedText>
          <ThemedText type="smallBold" style={styles.value}>
            {item.value}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    textAlign: 'center',
  },
});
