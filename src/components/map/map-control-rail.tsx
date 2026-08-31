import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import MapActionButton from '@/components/map/map-action-button';
import { CONTEXT_H, MAP_EDGE, MapZ, RAIL_BTN, RAIL_GAP } from '@/constants/map-layout';
import type { IconName } from '@/components/ui/icon';

export type RailItem = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  /** Brand tint, e.g. while the layers picker is open. */
  active?: boolean;
};

type MapControlRailProps = {
  items: RailItem[];
  /** gorhom's animatedPosition: the sheet's live y within its container. */
  sheetPosition: SharedValue<number>;
  /** Height of the sheet's container, i.e. screen height minus topInset. */
  containerHeight: number;
  /** Distance from the top of the map area to the bottom of the context bar. */
  contextTop: number;
  /** JS-driven, from onChange — never toggled from a worklet. */
  interactive: boolean;
};

/**
 * The right-edge control stack, anchored to the sheet rather than to a hardcoded
 * offset — it rides upward as the sheet expands, the way Google Maps does.
 *
 * Two independent guards: the position is CLAMPED so it can never geometrically
 * collide with the context bar even at full opacity, and it also FADES as the sheet
 * approaches. The clamp is what makes the layout proof hold; the fade is polish.
 */
export default function MapControlRail({
  items,
  sheetPosition,
  containerHeight,
  contextTop,
  interactive,
}: MapControlRailProps) {
  const height = items.length * RAIL_BTN + Math.max(0, items.length - 1) * RAIL_GAP;
  // Highest the rail may sit before it would touch the context bar.
  const maxBottom = containerHeight - contextTop - CONTEXT_H - RAIL_GAP - height;

  // Overlap begins the instant the sheet top passes `maxBottom`, because from there
  // the clamp stops the rail rising any further. So the fade must REACH zero exactly
  // there, not merely be under way — otherwise the rail is still faintly visible
  // while the sheet is drawn over it. Deriving both ends from the clamp is what
  // makes "never visible while overlapping" hold on every screen size.
  const fadeTo = maxBottom;
  const fadeFrom = maxBottom - RAIL_BTN;

  const animatedStyle = useAnimatedStyle(() => {
    const sheetTop = containerHeight - sheetPosition.value;
    const bottom = Math.min(sheetTop + RAIL_GAP, maxBottom);

    return {
      transform: [{ translateY: -bottom }],
      opacity: interpolate(sheetTop, [fadeFrom, fadeTo], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[styles.rail, animatedStyle]}
      pointerEvents={interactive ? 'box-none' : 'none'}
    >
      <View style={styles.stack} pointerEvents="box-none">
        {items.map((item) => (
          <MapActionButton
            key={item.icon}
            icon={item.icon}
            onPress={item.onPress}
            accessibilityLabel={item.accessibilityLabel}
            active={item.active}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    right: MAP_EDGE,
    bottom: 0,
    zIndex: MapZ.rail,
  },
  stack: {
    gap: RAIL_GAP,
  },
});
