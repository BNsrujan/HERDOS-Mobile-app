/**
 * Barrel for the design tokens. Import from '@/constants/theme' everywhere;
 * the split into colors.ts / tokens.ts is an implementation detail.
 */

import { Platform } from 'react-native';

export * from '@/constants/colors';
export * from '@/constants/tokens';

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});
