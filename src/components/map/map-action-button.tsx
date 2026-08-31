import { StyleSheet } from 'react-native';

import Icon, { type IconName } from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { Colors, Elevation, MinTouchTarget, Radius } from '@/constants/theme';

type MapActionButtonProps = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  /** Brand tint, e.g. while the layers picker this button opened is showing. */
  active?: boolean;
  disabled?: boolean;
};

/**
 * A white circular map control, Google style.
 *
 * Pinned to the light palette rather than the theme. This was previously the ONLY
 * map overlay that followed the colour scheme, so in dark mode it rendered as a
 * light circle with a dark glyph while every neighbouring overlay stayed
 * pinned-light — the odd one out on a surface that is always satellite imagery.
 */
export default function MapActionButton({
  icon,
  onPress,
  accessibilityLabel,
  active = false,
  disabled = false,
}: MapActionButtonProps) {
  return (
    <AppPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      minTouchTarget={false}
      style={[
        styles.button,
        { backgroundColor: active ? Colors.light.brand : Colors.light.surface },
      ]}
    >
      <Icon
        name={icon}
        size={20}
        color={active ? Colors.light.brandText : Colors.light.textPrimary}
      />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    // Spacing is the rail's job now — a margin here would sit inside the rail's
    // transparent bounds and block map drags between buttons.
    ...Elevation.fab,
  },
});
