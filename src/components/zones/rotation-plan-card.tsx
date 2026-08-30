import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import FenceSyncBadge from '@/components/zones/fence-sync-badge';
import type { RotationPlan } from '@/types/rotation';

type RotationPlanCardProps = {
  plan: RotationPlan;
  onAdvance: () => void;
  advancing?: boolean;
};

export default function RotationPlanCard({ plan, onAdvance, advancing }: RotationPlanCardProps) {
  const theme = useTheme();
  const due = plan.daysRemaining;

  return (
    <Card variant="elevated" radius="xl" style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="heading" numberOfLines={1} style={styles.title}>
          {plan.name}
        </ThemedText>
        <FenceSyncBadge sync={plan.sync} />
      </View>

      {/* The stepper is the anchor: position in the cycle should be legible
          without reading a word. */}
      <View style={styles.stepper}>
        {plan.steps.map((step, index) => {
          const isCurrent = index === plan.currentIndex;
          const isPast = index < plan.currentIndex;

          return (
            <View key={step.id} style={styles.stepWrap}>
              {index > 0 ? (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: isPast || isCurrent ? theme.brand : theme.border },
                  ]}
                />
              ) : null}
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: isCurrent ? theme.brand : theme.surfaceSunken,
                    borderColor: isCurrent ? theme.brand : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="caption"
                  style={{ color: isCurrent ? theme.brandText : theme.textSecondary }}
                >
                  {index + 1}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </View>

      <View>
        <ThemedText type="small">
          {plan.currentZoneName ?? 'No paddock selected'}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {due === null
            ? `${plan.dwellDays} day dwell`
            : due > 0
              ? `${due} day${due === 1 ? '' : 's'} left`
              : 'Move is due'}
        </ThemedText>
      </View>

      <Button
        size="sm"
        label="Advance now"
        variant={due !== null && due <= 0 ? 'primary' : 'secondary'}
        loading={advancing}
        onPress={onAdvance}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Space.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
  title: { flex: 1 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    width: 24,
    height: 2,
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
