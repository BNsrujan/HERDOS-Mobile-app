import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import Icon from '@/components/ui/icon';
import { Surface } from '@/components/ui/surface';
import { Colors, Elevation, Radius, Space } from '@/constants/theme';

type FarmHeaderPillProps = {
  name: string;
  onlineCount: number;
  totalCount: number;
};

/**
 * Pinned to the light scheme: it floats over satellite imagery, which is dark in
 * both themes, so a theme-following surface would be unreadable half the time.
 */
export default function FarmHeaderPill({ name, onlineCount, totalCount }: FarmHeaderPillProps) {
  return (
    <Surface scheme="light" level="surface" style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="home" size={16} color={Colors.light.info} />
      </View>
      <ThemedText type="smallBold" style={{ color: Colors.light.textPrimary }} numberOfLines={1}>
        {name}
      </ThemedText>
      <View style={styles.dot} />
      <ThemedText type="small" style={{ color: Colors.light.textSecondary }}>
        {onlineCount}/{totalCount} online
      </ThemedText>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Space.lg,
    alignSelf: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.md,
    borderRadius: Radius.full,
    ...Elevation.raised,
    zIndex: 2,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.infoSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.light.success,
  },
});
