import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { Elevation, Radius, Space, type Tone } from '@/constants/theme';
import { AppPressable } from '@/components/ui/pressable';
import { Surface, type SurfaceLevel } from '@/components/ui/surface';
import { useTheme } from '@/hooks/use-theme';

export type CardVariant = 'plain' | 'elevated' | 'outlined' | 'sunken' | 'tinted';

export type CardProps = Omit<ViewProps, 'style'> & {
  variant?: CardVariant;
  tone?: Tone;
  padding?: keyof typeof Space | 'none';
  radius?: keyof typeof Radius;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: ReactNode;
};

const LEVEL: Record<CardVariant, SurfaceLevel> = {
  plain: 'surface',
  elevated: 'elevated',
  outlined: 'surface',
  sunken: 'sunken',
  tinted: 'surface',
};

export function Card({
  variant = 'plain',
  tone = 'neutral',
  padding = 'lg',
  radius = 'lg',
  style,
  onPress,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();

  const base: ViewStyle = {
    borderRadius: Radius[radius],
    padding: padding === 'none' ? 0 : Space[padding],
    ...(variant === 'elevated' ? Elevation.card : null),
    ...(variant === 'outlined' ? { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: theme.border } : null),
    ...(variant === 'tinted' && tone !== 'neutral' ? { borderWidth: StyleSheet.hairlineWidth * 2 } : null),
  };

  const surface = (
    <Surface
      level={LEVEL[variant]}
      tone={variant === 'tinted' ? tone : 'neutral'}
      style={[base, style]}
      {...rest}
    >
      {children}
    </Surface>
  );

  if (!onPress) {
    return surface;
  }

  return (
    <AppPressable onPress={onPress} minTouchTarget={false} style={{ borderRadius: Radius[radius] }}>
      {surface}
    </AppPressable>
  );
}
