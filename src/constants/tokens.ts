import { Platform } from 'react-native';

/**
 * 4pt scale chosen to match actual usage: `12` is the most common gap in the app,
 * followed by 16, 8, 24, 10 and 20. Values not on the scale round to the nearest step.
 */
export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
} as const;

export const Elevation = {
  none: {},
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fab: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
} as const;

/** iOS HIG / Material both put the minimum comfortable touch target at 44pt. */
export const MinTouchTarget = 44;

export const HitSlop = {
  sm: { top: 6, bottom: 6, left: 6, right: 6 },
  md: { top: 10, bottom: 10, left: 10, right: 10 },
} as const;

export const Duration = { fast: 120, base: 200 } as const;

export const MaxContentWidth = 800;

/** Fallback only, for screens outside the tab navigator. Prefer useBottomTabBarHeight(). */
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

/**
 * @deprecated use `Space`. Kept so unmigrated screens keep compiling.
 */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
