import type { AnimalStatus } from '@/types/animal';

/** Raw ramps. Components should use the semantic `Colors` palette, not these. */
export const Grey = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#0B1220',
} as const;

export const Brand = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  500: '#22C55E',
  700: '#1A3C2A',
  900: '#0F2419',
} as const;

/**
 * Every token must exist in both schemes. Typing `Colors` as Record<scheme, Palette>
 * (rather than intersecting the two keysets) is what makes a token missing from one
 * scheme a compile error instead of a silent omission.
 */
export type Palette = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  surfaceInverse: string;
  overlay: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  textLink: string;

  border: string;
  borderStrong: string;
  divider: string;

  brand: string;
  brandPressed: string;
  brandText: string;
  brandSubtle: string;
  brandOnSubtle: string;

  accent: string;
  accentText: string;

  success: string;
  successSubtle: string;
  onSuccessSubtle: string;
  warning: string;
  warningSubtle: string;
  onWarningSubtle: string;
  danger: string;
  dangerSubtle: string;
  onDangerSubtle: string;
  info: string;
  infoSubtle: string;
  onInfoSubtle: string;

  disabledSurface: string;
  disabledText: string;
  pressedOverlay: string;
  focusRing: string;
  skeleton: string;

  /** @deprecated use textPrimary */
  text: string;
  /** @deprecated use surface */
  backgroundElement: string;
  /** @deprecated use surfaceSunken */
  backgroundSelected: string;
};

const light: Palette = {
  // Not pure white: it is what makes the many #FFFFFF cards read as raised surfaces.
  background: Grey[50],
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSunken: Grey[100],
  surfaceInverse: Grey[900],
  overlay: 'rgba(17,24,39,0.45)',

  textPrimary: Grey[900],
  textSecondary: Grey[500],
  textTertiary: Grey[400],
  textInverse: '#FFFFFF',
  textLink: '#2563EB',

  border: Grey[200],
  borderStrong: Grey[300],
  divider: Grey[200],

  brand: Brand[700],
  brandPressed: Brand[900],
  brandText: '#FFFFFF',
  brandSubtle: Brand[50],
  brandOnSubtle: '#166534',

  accent: Brand[500],
  accentText: '#FFFFFF',

  success: '#16A34A',
  successSubtle: '#DCFCE7',
  onSuccessSubtle: '#166534',
  warning: '#D97706',
  warningSubtle: '#FEF3C7',
  onWarningSubtle: '#92400E',
  danger: '#DC2626',
  dangerSubtle: '#FEF2F2',
  onDangerSubtle: '#B91C1C',
  info: '#2563EB',
  infoSubtle: '#E0F2FE',
  onInfoSubtle: '#075985',

  disabledSurface: Grey[200],
  disabledText: Grey[400],
  pressedOverlay: 'rgba(17,24,39,0.08)',
  focusRing: '#2563EB',
  skeleton: Grey[200],

  text: Grey[900],
  backgroundElement: '#FFFFFF',
  backgroundSelected: Grey[100],
};

const dark: Palette = {
  background: Grey[950],
  surface: Grey[900],
  surfaceElevated: Grey[800],
  surfaceSunken: '#0F172A',
  surfaceInverse: Grey[100],
  overlay: 'rgba(0,0,0,0.6)',

  textPrimary: Grey[50],
  textSecondary: Grey[400],
  textTertiary: Grey[500],
  textInverse: Grey[900],
  textLink: '#60A5FA',

  border: Grey[700],
  borderStrong: Grey[600],
  divider: Grey[800],

  brand: '#2E6B4A',
  brandPressed: '#3E8560',
  brandText: '#FFFFFF',
  brandSubtle: '#123024',
  brandOnSubtle: '#86EFAC',

  accent: Brand[500],
  accentText: '#062E15',

  success: '#22C55E',
  successSubtle: '#0C2A19',
  onSuccessSubtle: '#86EFAC',
  warning: '#F59E0B',
  warningSubtle: '#2C1F06',
  onWarningSubtle: '#FCD34D',
  danger: '#F87171',
  dangerSubtle: '#2A1113',
  onDangerSubtle: '#FCA5A5',
  info: '#60A5FA',
  infoSubtle: '#0B2239',
  onInfoSubtle: '#93C5FD',

  disabledSurface: Grey[800],
  disabledText: Grey[600],
  pressedOverlay: 'rgba(255,255,255,0.10)',
  focusRing: '#60A5FA',
  skeleton: Grey[800],

  text: Grey[50],
  backgroundElement: Grey[900],
  backgroundSelected: '#0F172A',
};

export const Colors: Record<'light' | 'dark', Palette> = { light, dark };

export type ThemeColor = keyof Palette;

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export const StatusColors: Record<AnimalStatus, string> = {
  healthy: '#22C55E',
  watch: '#F5A524',
  alert: '#EF4444',
  lame: '#F43F5E',
  milking: '#3B82F6',
  pregnant: '#A855F7',
};

/** Theme-aware equivalent of StatusColors, for Badge/Chip tones. */
export const StatusTone: Record<AnimalStatus, Tone> = {
  healthy: 'success',
  watch: 'warning',
  alert: 'danger',
  lame: 'danger',
  milking: 'info',
  pregnant: 'brand',
};

export const StatusLabels: Record<AnimalStatus, string> = {
  healthy: 'Healthy',
  watch: 'Watch',
  alert: 'Alert',
  lame: 'Lame',
  milking: 'Milking',
  pregnant: 'Pregnant',
};

export const AvatarColors = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#0F766E'] as const;

export const MapStatusColors: Record<AnimalStatus, string> = {
  healthy: StatusColors.healthy,
  milking: StatusColors.healthy,
  pregnant: StatusColors.healthy,
  watch: StatusColors.watch,
  alert: StatusColors.alert,
  lame: StatusColors.alert,
};
