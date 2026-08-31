import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MinTouchTarget, Space } from '@/constants/theme';

/**
 * Single source of truth for Map screen chrome geometry.
 *
 * THE ONE RULE: the bottom tab bar is a flex SIBLING of this screen, not an overlay.
 * `bottom: 0` here is already the top edge of the tab bar, which is itself already
 * above the home indicator. So bottom-anchored chrome on the map adds NO insets —
 * no `insets.bottom`, no `BottomTabInset`. The only bottom term is a visual gap.
 *
 * Getting this wrong is what produced 92pt (iOS) / 112pt (Android) of dead padding
 * in the old trail console and 34pt in the old animals sheet.
 */

/** Gap from the screen edges. */
export const MAP_EDGE = Space.lg; // 16
/** Vertical gap between stacked rail buttons, and between chrome elements. */
export const RAIL_GAP = Space.md; // 12
export const RAIL_BTN = MinTouchTarget; // 44
/** Height of the context bar pill. */
export const CONTEXT_H = 44;

/**
 * Sheet detents, in points from the tab-bar edge.
 *
 * Module constants, not `useMemo` results: gorhom re-measures whenever the array
 * identity changes, and a frozen module value gives the React Compiler nothing to
 * reason about.
 */
export const BROWSE_SNAPS = [152, 340, '100%'] as const;
export const TRAIL_SNAPS = [176, 380, '100%'] as const;

/** Draft owns the bottom surface exclusively; the sheet is unmounted, not collapsed. */
export const DRAFT_TOOLBAR_H = 158;

/**
 * Z scale, spaced widely on purpose.
 *
 * The bug this restructure removes was two siblings at the same zIndex, resolved by
 * declaration order on iOS and by Android elevation — i.e. differently per platform.
 * Ties are the hazard, so leave room.
 */
export const MapZ = {
  sheet: 10,
  draftToolbar: 10,
  rail: 15,
  contextBar: 20,
} as const;

/**
 * The map draws UNDER the status bar (full-bleed, `headerShown: false`) but never
 * under the tab bar.
 */
export function useMapChromeInsets() {
  const insets = useSafeAreaInsets();
  const contextTop = insets.top + Space.sm;

  return {
    contextTop,
    /** Passed to the sheet as `topInset` so it can never cover the context bar. */
    sheetTopInset: contextTop + CONTEXT_H + RAIL_GAP,
    bottom: 0,
  };
}
