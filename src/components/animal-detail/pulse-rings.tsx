import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import Icon from '@/components/ui/icon';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PulseRingsProps = {
  active: boolean;
};

const RING_STYLES = [
  { size: 280, opacity: 0.16, delay: 0 },
  { size: 190, opacity: 0.24, delay: 180 },
  { size: 120, opacity: 0.34, delay: 360 },
] as const;

/**
 * Extracted so useAnimatedStyle is not called inside a .map() callback, which
 * violates the rules of hooks (and the React Compiler is enabled in app.json).
 */
function Ring({
  size,
  opacity,
  color,
  pulse,
}: {
  size: number;
  opacity: number;
  color: string;
  pulse: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View
      style={[styles.ring, { width: size, height: size, opacity, borderColor: color }, animatedStyle]}
    />
  );
}

export default function PulseRings({ active }: PulseRingsProps) {
  const theme = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      pulse.value = 1;
      return;
    }

    pulse.value = withSequence(
      ...RING_STYLES.flatMap(({ delay }) => [
        withDelay(delay, withTiming(1.15, { duration: 420, easing: Easing.inOut(Easing.ease) })),
        withDelay(delay + 420, withTiming(1, { duration: 420, easing: Easing.inOut(Easing.ease) })),
        withDelay(delay + 840, withTiming(1.15, { duration: 420, easing: Easing.inOut(Easing.ease) })),
        withDelay(delay + 1260, withTiming(1, { duration: 420, easing: Easing.inOut(Easing.ease) })),
      ]),
    );

    const timeout = setTimeout(() => {
      pulse.value = 1;
    }, 3200);

    return () => clearTimeout(timeout);
  }, [active, pulse]);

  return (
    <View style={styles.container}>
      {RING_STYLES.map((ring) => (
        <Ring
          key={ring.size}
          size={ring.size}
          opacity={ring.opacity}
          color={theme.success}
          pulse={pulse}
        />
      ))}
      <View style={[styles.centerCircle, { backgroundColor: theme.successSubtle }]}>
        <Icon name="speaker" size={32} color={theme.success} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: Radius.full,
    borderWidth: 2,
  },
  centerCircle: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
