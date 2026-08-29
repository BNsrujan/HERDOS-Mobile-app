import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AvatarColors, Radius } from '@/constants/theme';

const nameHash = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export function getAvatarColor(name: string) {
  return AvatarColors[nameHash(name) % AvatarColors.length];
}

type AvatarProps = {
  photoUrl?: string;
  name: string;
  size?: number;
  shape?: 'circle' | 'rounded';
};

export default function Avatar({ photoUrl, name, size = 56, shape = 'circle' }: AvatarProps) {
  const borderRadius = shape === 'circle' ? size / 2 : Radius.lg;

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={{ width: size, height: size, borderRadius }}
        contentFit="cover"
        transition={150}
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius, backgroundColor: getAvatarColor(name) },
      ]}
      accessibilityLabel={name}
    >
      {/* Fixed white: the fallback background is always a saturated avatar color. */}
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
