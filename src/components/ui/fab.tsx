import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon, { type IconName } from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { BottomTabInset, Elevation, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type FabProps = {
  icon: IconName;
  onPress: () => void;
  /** Required: an icon-only control is unusable to a screen reader without it. */
  accessibilityLabel: string;
  tone?: 'accent' | 'brand';
  /** Set when the FAB sits on a screen inside the tab navigator. */
  hasTabBar?: boolean;
};

/**
 * Owns its own bottom clearance so it can never sit under the tab bar or the home
 * indicator - previously each screen guessed a different offset.
 */
export function Fab({ icon, onPress, accessibilityLabel, tone = 'accent', hasTabBar = false }: FabProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const background = tone === 'accent' ? theme.accent : theme.brand;
  const foreground = tone === 'accent' ? theme.accentText : theme.brandText;

  return (
    <AppPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      minTouchTarget={false}
      style={[
        styles.fab,
        {
          backgroundColor: background,
          bottom: insets.bottom + (hasTabBar ? BottomTabInset : 0) + Space.lg,
        },
      ]}
    >
      <Icon name={icon} color={foreground} size={24} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Space['2xl'],
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.fab,
  },
});
