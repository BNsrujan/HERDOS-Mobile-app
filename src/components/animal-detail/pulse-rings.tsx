import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';

import IconSymbol from '@/components/ui/icon-symbol';

type PulseRingsProps = {
  active: boolean;
};

const RING_STYLES = [
  { size: 280, opacity: 0.16, delay: 0 },
  { size: 190, opacity: 0.24, delay: 180 },
  { size: 120, opacity: 0.34, delay: 360 },
] as const;

export default function PulseRings({ active }: PulseRingsProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      pulse.value = 1;
      return;
    }

    const ringAnimation = withSequence(
      ...RING_STYLES.flatMap(({ delay }, index) => [
        withDelay(delay, withTiming(1.15, { duration: 420, easing: Easing.inOut(Easing.ease) })),
        withDelay(delay + 420, withTiming(1, { duration: 420, easing: Easing.inOut(Easing.ease) })),
        withDelay(delay + 840, withTiming(1.15, { duration: 420, easing: Easing.inOut(Easing.ease) })),
        withDelay(delay + 1260, withTiming(1, { duration: 420, easing: Easing.inOut(Easing.ease) })),
      ])
    );

    pulse.value = ringAnimation;

    const timeout = setTimeout(() => {
      pulse.value = 1;
    }, 3200);

    return () => clearTimeout(timeout);
  }, [active, pulse]);

  return (
    <View style={styles.container}>
      {RING_STYLES.map((ring, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: pulse.value }],
          opacity: ring.opacity,
        }));

        return (
          <Animated.View
            key={ring.size}
            style={[styles.ring, { width: ring.size, height: ring.size, opacity: ring.opacity }, animatedStyle]}
          />
        );
      })}
      <View style={styles.centerCircle}>
        <IconSymbol name="speaker" size={32} color="#22C55E" />
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
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  centerCircle: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
