import { StyleSheet } from 'react-native';

import Icon, { type IconName } from '@/components/ui/icon';
import { AppPressable } from '@/components/ui/pressable';
import { MinTouchTarget, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MapActionButtonProps = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
};

export default function MapActionButton({ icon, onPress, accessibilityLabel }: MapActionButtonProps) {
  const theme = useTheme();

  return (
    <AppPressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      minTouchTarget={false}
      style={[styles.button, { backgroundColor: theme.surfaceInverse }]}
    >
      <Icon name={icon} size={20} color={theme.textInverse} />
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
    marginBottom: Space.sm,
  },
});
