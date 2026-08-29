import { forwardRef } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';

import { HitSlop } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AppPressableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  feedback?: 'opacity' | 'overlay' | 'scale' | 'none';
  /** Expands the touch area to ~44pt without changing the visual size. */
  minTouchTarget?: boolean;
};

/**
 * The single source of press feedback in the app. Bare react-native `Pressable`
 * has none by default, which is why 38 call sites felt dead on tap.
 */
export const AppPressable = forwardRef<View, AppPressableProps>(function AppPressable(
  {
    style,
    feedback = 'opacity',
    minTouchTarget = true,
    disabled,
    hitSlop,
    accessibilityRole,
    ...rest
  },
  ref,
) {
  const theme = useTheme();

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      hitSlop={hitSlop ?? (minTouchTarget ? HitSlop.md : undefined)}
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityState={{ disabled: Boolean(disabled) }}
      android_ripple={feedback === 'none' ? undefined : { color: theme.pressedOverlay }}
      style={({ pressed }) => [
        style,
        disabled ? { opacity: 0.4 } : null,
        pressed && !disabled && feedback === 'opacity' ? { opacity: 0.6 } : null,
        pressed && !disabled && feedback === 'overlay' ? { backgroundColor: theme.pressedOverlay } : null,
        pressed && !disabled && feedback === 'scale' ? { transform: [{ scale: 0.97 }] } : null,
      ]}
      {...rest}
    />
  );
});
