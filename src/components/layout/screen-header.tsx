import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type ScreenHeaderProps = ViewProps & {
  title: string;
  right?: React.ReactNode;
};

export default function ScreenHeader({ title, right, style, ...rest }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.four }, style]} {...rest}>
      <View style={styles.row}>
        <ThemedText type="pageTitle">{title}</ThemedText>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  right: {
    marginLeft: 'auto',
  },
});
