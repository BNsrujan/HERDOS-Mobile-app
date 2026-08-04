import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import IconSymbol, { type IconSymbolName } from '@/components/ui/icon-symbol';

type SettingsRowProps = {
  icon: IconSymbolName;
  label: string;
  right?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
};

export default function SettingsRow({ icon, label, right, onPress, chevron = false }: SettingsRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row} disabled={!onPress}>
      <View style={styles.left}>
        <IconSymbol name={icon} size={18} />
        <ThemedText type="smallBold">{label}</ThemedText>
      </View>
      <View style={styles.right}>
        {right}
        {chevron ? <ThemedText type="smallBold" style={styles.chevron}>›</ThemedText> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  chevron: {
    fontSize: 18,
  },
});
