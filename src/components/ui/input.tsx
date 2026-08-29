import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: 'md' | 'lg';
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Always sets `color` and `placeholderTextColor`. The hand-rolled inputs it replaces
 * set neither, so their text rendered black-on-black in dark mode.
 */
export function Input({
  label,
  helperText,
  errorText,
  size = 'md',
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = errorText ? theme.danger : focused ? theme.focusRing : theme.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}

      <TextInput
        placeholderTextColor={theme.textTertiary}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            minHeight: size === 'lg' ? 52 : MinTouchTarget,
            color: theme.textPrimary,
            backgroundColor: theme.surfaceSunken,
            borderColor,
          },
        ]}
        {...rest}
      />

      {errorText ? (
        <ThemedText type="caption" style={{ color: theme.danger }}>
          {errorText}
        </ThemedText>
      ) : helperText ? (
        <ThemedText type="caption" themeColor="textSecondary">
          {helperText}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Space.xs,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: Radius.md,
    paddingHorizontal: Space.md,
    paddingVertical: Space.md,
    fontSize: 16,
  },
});
