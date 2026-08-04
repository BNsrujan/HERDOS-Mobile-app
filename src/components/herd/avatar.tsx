import { Image, StyleSheet, Text, View } from 'react-native';

import { AvatarColors } from '@/constants/theme';

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
};

export default function Avatar({ photoUrl, name, size = 56 }: AvatarProps) {
  const color = getAvatarColor(name);

  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={[styles.photo, { width: size, height: size, borderRadius: size / 2 }]} />;
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}> 
      <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  photo: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
});
