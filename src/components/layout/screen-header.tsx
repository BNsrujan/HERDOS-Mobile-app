import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
};

/**
 * Deliberately does NOT apply safe-area insets - ScreenContainer owns that, so the
 * inset is applied exactly once and never doubled.
 */
export default function ScreenHeader({ title, subtitle, back, right }: ScreenHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {back ? (
          <AppPressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            style={[styles.backButton, { backgroundColor: theme.surfaceSunken }]}
          >
            <Icon name="chevron" size={18} color={theme.textPrimary} />
          </AppPressable>
        ) : null}

        <ThemedText type="title" style={styles.title} numberOfLines={2}>
          {title}
        </ThemedText>

        {right ? <View style={styles.right}>{right}</View> : null}
      </View>

      {subtitle ? (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Space.lg,
    gap: Space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  title: {
    flex: 1,
  },
  backButton: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleX: -1 }],
  },
  right: {
    marginLeft: 'auto',
  },
});
