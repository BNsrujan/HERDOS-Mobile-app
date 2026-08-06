import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing, BottomTabInset } from '@/constants/theme';

export type ScreenContainerProps = ViewProps & {
  hasTabBar?: boolean;
};

export default function ScreenContainer({ hasTabBar = true, style, ...rest }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = hasTabBar ? BottomTabInset + insets.bottom : insets.bottom;

  return <View style={[styles.container, { paddingBottom: bottomPadding }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
});
