import type { ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenContainerProps = {
  children: ReactNode;
  /** Renders the content in a ScrollView. */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: ('top' | 'bottom')[];
  padded?: boolean;
  hasTabBar?: boolean;
  /** Adds clearance so a floating action button never covers the last row. */
  hasFab?: boolean;
  background?: 'background' | 'surface';
  /** Rendered above the scroll area and pinned. */
  header?: ReactNode;
  /** Rendered on top of everything, outside the scroll area (FABs, overlays). */
  floating?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * The one place safe-area insets, tab-bar clearance and screen padding are resolved.
 * Screens previously hardcoded their own bottom padding (24 / 48 / 80 / 96 / 0) and
 * none of them accounted for the notch.
 */
export default function ScreenContainer({
  children,
  scroll = false,
  refreshing,
  onRefresh,
  edges = ['top', 'bottom'],
  padded = true,
  hasTabBar = false,
  hasFab = false,
  background = 'background',
  header,
  floating,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom =
    (edges.includes('bottom') ? insets.bottom : 0) +
    // TODO: prefer useBottomTabBarHeight() once @react-navigation/bottom-tabs is an
    // explicit dependency; BottomTabInset is only an approximation.
    (hasTabBar ? BottomTabInset : 0) +
    (hasFab ? 88 : Space['2xl']);

  const horizontal = padded ? Space['2xl'] : 0;

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        { paddingHorizontal: horizontal, paddingBottom },
        !header && { paddingTop: paddingTop + Space['2xl'] },
        contentContainerStyle,
      ]}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} /> : undefined
      }
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        { paddingHorizontal: horizontal, paddingBottom },
        !header && { paddingTop: paddingTop + Space['2xl'] },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: theme[background] }, style]}>
      {header ? (
        <View style={{ paddingTop: paddingTop + Space.lg, paddingHorizontal: horizontal }}>{header}</View>
      ) : null}
      {body}
      {floating}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
