import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Space } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText type="overline" themeColor="textSecondary">
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Space.sm,
    marginBottom: Space.xs,
  },
});
