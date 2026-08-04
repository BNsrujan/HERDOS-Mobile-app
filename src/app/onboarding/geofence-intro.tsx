import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GeofenceIntroScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/welcoming/welcom3.png')} style={styles.image} />
      <ThemedText type="title">Know Where They Are. Always.</ThemedText>
      <ThemedText type="small">Set up geofences to keep the herd safe and receive instant entry alerts.</ThemedText>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/onboarding/language-select')}>
          <ThemedText type="link">Next</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  actions: {
    marginTop: 24,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#1A3C2A',
  },
});
