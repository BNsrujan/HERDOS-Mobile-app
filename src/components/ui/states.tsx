import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function LoadingState({ size = 'lg', label }: { size?: 'sm' | 'lg'; label?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.centered}>
      <ActivityIndicator size={size === 'lg' ? 'large' : 'small'} color={theme.textSecondary} />
      {label ? (
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; onPress: () => void };
}) {
  return (
    <Card variant="sunken" style={styles.stateCard}>
      <ThemedText type="bodyBold">{title}</ThemedText>
      {description ? (
        <ThemedText type="small" themeColor="textSecondary">
          {description}
        </ThemedText>
      ) : null}
      {action ? <Button size="sm" label={action.label} onPress={action.onPress} /> : null}
    </Card>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Check your connection and try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Card variant="tinted" tone="danger" style={styles.stateCard}>
      <ThemedText type="bodyBold">{title}</ThemedText>
      <ThemedText type="small">{description}</ThemedText>
      {onRetry ? <Button size="sm" variant="secondary" label="Retry" onPress={onRetry} /> : null}
    </Card>
  );
}

export type QueryBoundaryProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  empty?: { title: string; description?: string };
  error?: { title?: string; description?: string };
  children: ReactNode;
};

/**
 * Collapses the `isLoading ? ... : isError ? ... : isEmpty ? ...` ladder that every
 * screen re-implemented differently (six error strings, four spinner colors).
 */
export function QueryBoundary({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  empty,
  error,
  children,
}: QueryBoundaryProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState {...error} onRetry={onRetry} />;
  if (isEmpty && empty) return <EmptyState {...empty} />;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    paddingVertical: Space['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.md,
  },
  stateCard: {
    gap: Space.sm,
    alignItems: 'flex-start',
  },
});
