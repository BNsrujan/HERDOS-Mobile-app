import { StyleSheet, View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

/**
 * An explicit `type` always wins over a `backgroundColor` in `style`; the implicit
 * default stays overridable. Previously the theme color was always laid down first,
 * so any hardcoded background silently defeated the `type` prop (and stayed light
 * in dark mode).
 */
export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  if (__DEV__ && type) {
    const flattened = StyleSheet.flatten(style) as { backgroundColor?: unknown } | undefined;
    if (flattened?.backgroundColor !== undefined) {
      console.warn(
        `ThemedView: type="${type}" is being combined with a hardcoded backgroundColor. ` +
          'Drop one of them - the hardcoded value will not adapt to dark mode.',
      );
    }
  }

  return (
    <View
      style={[
        type ? null : { backgroundColor: theme.background },
        style,
        type ? { backgroundColor: theme[type] } : null,
      ]}
      {...otherProps}
    />
  );
}
