import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

type PowerToggleProps = {
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

export default function PowerToggle({ value, onChange, disabled = false }: PowerToggleProps) {
  const thumbX = useSharedValue(value ? 214 : 0);

  useEffect(() => {
    thumbX.value = withTiming(value ? 214 : 0, { duration: 240 });
  }, [thumbX, value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={[styles.track, disabled && styles.disabled, value ? styles.trackOn : styles.trackOff]}
    >
      <ThemedText type="smallBold" style={[styles.label, styles.labelLeft, value ? styles.labelVisible : styles.labelHidden]}>ON</ThemedText>
      <ThemedText type="smallBold" style={[styles.label, styles.labelRight, value ? styles.labelHidden : styles.labelVisible]}>OFF</ThemedText>
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 280,
    height: 64,
    borderRadius: 999,
    paddingHorizontal: 8,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackOn: {
    backgroundColor: '#22C55E',
  },
  trackOff: {
    backgroundColor: '#D1FAE5',
  },
  disabled: {
    opacity: 0.55,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 8,
    top: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  label: {
    position: 'absolute',
    zIndex: 1,
    fontSize: 14,
  },
  labelLeft: {
    left: 18,
  },
  labelRight: {
    right: 18,
  },
  labelVisible: {
    opacity: 1,
  },
  labelHidden: {
    opacity: 0,
  },
});
