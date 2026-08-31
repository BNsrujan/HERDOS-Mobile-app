import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { Surface } from '@/components/ui/surface';
import { CONTEXT_H, MAP_EDGE, MapZ, useMapChromeInsets } from '@/constants/map-layout';
import { Colors, Elevation, MinTouchTarget, Radius, Space } from '@/constants/theme';

type MapContextBarProps = {
  title: string;
  subtitle?: string;
  /** Shown as a green dot before the subtitle, for the online count. */
  showStatusDot?: boolean;
  /** Renders a leading exit control — a second, always-visible way out of a mode. */
  onExit?: () => void;
  exitLabel?: string;
  exitIcon?: 'arrow-left' | 'close';
};

/**
 * Top context bar: says what mode the map is in, and offers a way out of it.
 *
 * Safe-area aware, unlike the fixed `top: 48` it replaces — on a Dynamic Island
 * device that put the pill's top 11pt underneath the island.
 *
 * The leading exit control matters: previously the only escape from the trail
 * console was its own ✕, and from a draft opened over a trail there was none at all.
 */
export default function MapContextBar({
  title,
  subtitle,
  showStatusDot = false,
  onExit,
  exitLabel,
  exitIcon = 'arrow-left',
}: MapContextBarProps) {
  const chrome = useMapChromeInsets();

  return (
    // box-none so only the pill takes touches; the rest of the band stays map.
    <View style={[styles.wrapper, { top: chrome.contextTop }]} pointerEvents="box-none">
      <Surface scheme="light" level="surface" style={styles.bar}>
        {onExit ? (
          <AppPressable
            onPress={onExit}
            accessibilityLabel={exitLabel ?? 'Go back'}
            minTouchTarget
            style={styles.exit}
          >
            <Icon name={exitIcon} size={18} color={Colors.light.textPrimary} />
          </AppPressable>
        ) : (
          <View style={styles.iconCircle}>
            <Icon name="home" size={16} color={Colors.light.info} />
          </View>
        )}

        <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>

        {subtitle ? (
          <>
            {showStatusDot ? <View style={styles.dot} /> : null}
            <ThemedText type="small" style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </ThemedText>
          </>
        ) : null}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: MAP_EDGE,
    right: MAP_EDGE,
    alignItems: 'center',
    zIndex: MapZ.contextBar,
  },
  bar: {
    minHeight: CONTEXT_H,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.md,
    borderRadius: Radius.full,
    ...Elevation.raised,
  },
  exit: {
    width: MinTouchTarget - 12,
    height: MinTouchTarget - 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Space.xs,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.infoSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flexShrink: 1,
    color: Colors.light.textPrimary,
  },
  subtitle: {
    flexShrink: 1,
    color: Colors.light.textSecondary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.success,
  },
});
