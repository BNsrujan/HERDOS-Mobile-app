import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon, { type IconName } from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'dangerOutline';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'rounded';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
};

const SIZES = {
  sm: { minHeight: 36, paddingHorizontal: Space.md, type: 'smallBold' as const },
  md: { minHeight: MinTouchTarget, paddingHorizontal: Space.lg, type: 'smallBold' as const },
  lg: { minHeight: 52, paddingHorizontal: Space.xl, type: 'bodyBold' as const },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  fullWidth,
  loading,
  disabled,
  iconLeft,
  iconRight,
  style,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const theme = useTheme();
  const sizing = SIZES[size];
  const isDisabled = Boolean(disabled || loading);

  // One disabled rule for every variant, replacing the four different treatments
  // that used to be scattered across the app.
  const palette = isDisabled
    ? { background: theme.disabledSurface, foreground: theme.disabledText, border: 'transparent' }
    : {
        primary: { background: theme.brand, foreground: theme.brandText, border: 'transparent' },
        accent: { background: theme.accent, foreground: theme.accentText, border: 'transparent' },
        secondary: { background: theme.surfaceSunken, foreground: theme.textPrimary, border: 'transparent' },
        outline: { background: 'transparent', foreground: theme.textPrimary, border: theme.borderStrong },
        ghost: { background: 'transparent', foreground: theme.textLink, border: 'transparent' },
        danger: { background: theme.danger, foreground: '#FFFFFF', border: 'transparent' },
        dangerOutline: { background: 'transparent', foreground: theme.danger, border: theme.danger },
      }[variant];

  return (
    <AppPressable
      onPress={onPress}
      disabled={isDisabled}
      minTouchTarget={false}
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
      style={[
        styles.base,
        {
          minHeight: sizing.minHeight,
          paddingHorizontal: sizing.paddingHorizontal,
          borderRadius: shape === 'pill' ? Radius.full : Radius.md,
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderWidth: palette.border === 'transparent' ? 0 : StyleSheet.hairlineWidth * 2,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {/* Keep the label mounted while loading so the button does not change width. */}
      {iconLeft ? (
        <View style={loading && styles.hidden}>
          <Icon name={iconLeft} size={16} color={palette.foreground} />
        </View>
      ) : null}
      <ThemedText
        type={sizing.type}
        numberOfLines={1}
        style={[{ color: palette.foreground }, loading && styles.hidden]}
      >
        {label}
      </ThemedText>
      {iconRight ? (
        <View style={loading && styles.hidden}>
          <Icon name={iconRight} size={16} color={palette.foreground} />
        </View>
      ) : null}
      {loading ? (
        <View style={StyleSheet.absoluteFill}>
          <ActivityIndicator style={styles.spinner} color={palette.foreground} />
        </View>
      ) : null}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    flexWrap: 'nowrap',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  hidden: {
    opacity: 0,
  },
  spinner: {
    flex: 1,
  },
});
