import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText type="smallBold" style={styles.title}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#6B7280',
  },
});
