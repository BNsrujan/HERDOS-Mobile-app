import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** React Navigation's bottom-tabs bar height, before the safe-area inset. */
const TAB_BAR_CONTENT_HEIGHT = 49;

/**
 * Height of the bottom tab bar.
 *
 * Replaces the `BottomTabInset` constant, which hardcoded ios 50 / android 80. The
 * real height is `49 + insets.bottom` on BOTH platforms, so the old Android value
 * over-reserved by 30-50pt depending on the navigation mode.
 *
 * Only needed by content that overlays the tab bar. A screen rendered INSIDE the tab
 * navigator does not need this at all — the bar is a flex sibling and its space is
 * already excluded.
 */
export function useBottomTabInset() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_CONTENT_HEIGHT + insets.bottom;
}
