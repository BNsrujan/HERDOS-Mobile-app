import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Space } from '@/constants/theme';

type VitalsRowProps = {
  bodyTempC: number | null;
  activityPercent: number | null;
  ruminationHours: number | null;
};

const EMPTY = '—';

export default function VitalsRow({ bodyTempC, activityPercent, ruminationHours }: VitalsRowProps) {
  const items = [
    { label: 'Body temp', value: bodyTempC !== null ? `${bodyTempC.toFixed(1)}°C` : EMPTY },
    { label: 'Activity', value: activityPercent !== null ? `${activityPercent}%` : EMPTY },
    { label: 'Rumination', value: ruminationHours !== null ? `${ruminationHours.toFixed(1)}h` : EMPTY },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Card key={item.label} variant="sunken" padding="md" style={styles.card}>
          <ThemedText type="caption" themeColor="textSecondary" style={styles.center}>
            {item.label}
          </ThemedText>
          <ThemedText type="smallBold" style={styles.center}>
            {item.value}
          </ThemedText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Space.md,
    marginBottom: Space.lg,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.xs,
  },
  center: {
    textAlign: 'center',
  },
});
