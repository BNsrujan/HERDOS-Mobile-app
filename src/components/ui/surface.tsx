import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { Colors, type Palette, type Tone } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SurfaceLevel = 'background' | 'surface' | 'elevated' | 'sunken' | 'inverse';

type SurfaceValue = {
  palette: Palette;
  fg: string;
  fgSecondary: string;
  border: string;
};

const SurfaceContext = createContext<SurfaceValue | null>(null);

/**
 * Text and icons read their default color from the nearest Surface rather than from
 * the raw theme. That is what makes "light card + theme-colored text" (invisible in
 * dark mode) structurally impossible rather than a thing to remember.
 */
export function useSurface(): SurfaceValue {
  const theme = useTheme();
  const ctx = useContext(SurfaceContext);

  return (
    ctx ?? {
      palette: theme,
      fg: theme.textPrimary,
      fgSecondary: theme.textSecondary,
      border: theme.border,
    }
  );
}

const TONE_SUBTLE: Record<Exclude<Tone, 'neutral'>, { bg: keyof Palette; fg: keyof Palette; border: keyof Palette }> = {
  brand: { bg: 'brandSubtle', fg: 'brandOnSubtle', border: 'brand' },
  success: { bg: 'successSubtle', fg: 'onSuccessSubtle', border: 'success' },
  warning: { bg: 'warningSubtle', fg: 'onWarningSubtle', border: 'warning' },
  danger: { bg: 'dangerSubtle', fg: 'onDangerSubtle', border: 'danger' },
  info: { bg: 'infoSubtle', fg: 'onInfoSubtle', border: 'info' },
};

export type SurfaceProps = ViewProps & {
  level?: SurfaceLevel;
  tone?: Tone;
  /** Pin the surface to one scheme. Used for overlays on satellite imagery. */
  scheme?: 'auto' | 'light' | 'dark';
  children?: ReactNode;
};

export function resolveSurface(
  palette: Palette,
  level: SurfaceLevel,
  tone: Tone,
): { backgroundColor: string } & SurfaceValue {
  if (tone !== 'neutral') {
    const map = TONE_SUBTLE[tone];
    return {
      backgroundColor: palette[map.bg],
      palette,
      fg: palette[map.fg],
      fgSecondary: palette[map.fg],
      border: palette[map.border],
    };
  }

  switch (level) {
    case 'inverse':
      return {
        backgroundColor: palette.surfaceInverse,
        palette,
        fg: palette.textInverse,
        fgSecondary: palette.textInverse,
        border: palette.borderStrong,
      };
    case 'elevated':
      return {
        backgroundColor: palette.surfaceElevated,
        palette,
        fg: palette.textPrimary,
        fgSecondary: palette.textSecondary,
        border: palette.border,
      };
    case 'sunken':
      return {
        backgroundColor: palette.surfaceSunken,
        palette,
        fg: palette.textPrimary,
        fgSecondary: palette.textSecondary,
        border: palette.border,
      };
    case 'background':
      return {
        backgroundColor: palette.background,
        palette,
        fg: palette.textPrimary,
        fgSecondary: palette.textSecondary,
        border: palette.border,
      };
    case 'surface':
    default:
      return {
        backgroundColor: palette.surface,
        palette,
        fg: palette.textPrimary,
        fgSecondary: palette.textSecondary,
        border: palette.border,
      };
  }
}

export function Surface({
  level = 'surface',
  tone = 'neutral',
  scheme = 'auto',
  style,
  children,
  ...rest
}: SurfaceProps) {
  const theme = useTheme();
  const palette = scheme === 'auto' ? theme : Colors[scheme];

  const resolved = useMemo(() => resolveSurface(palette, level, tone), [palette, level, tone]);
  const { backgroundColor, ...value } = resolved;

  return (
    <SurfaceContext.Provider value={value}>
      <View style={[{ backgroundColor }, style]} {...rest}>
        {children}
      </View>
    </SurfaceContext.Provider>
  );
}
