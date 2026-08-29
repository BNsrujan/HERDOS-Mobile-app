import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Space } from '@/constants/theme';
import type { HerdAlert } from '@/types/alert';
import { getAlertBody, getAlertTitle } from '@/utils/alert-display';

type CriticalAlertBannerProps = {
  alert?: HerdAlert;
};

export default function CriticalAlertBanner({ alert }: CriticalAlertBannerProps) {
  if (!alert) {
    return null;
  }

  return (
    <Card variant="tinted" tone="danger" style={styles.banner}>
      <ThemedText type="smallBold">Critical panic alert</ThemedText>
      <ThemedText type="small">
        {getAlertTitle(alert)} • {getAlertBody(alert)}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  banner: {
    gap: Space.xs,
    marginBottom: Space.lg,
  },
});
