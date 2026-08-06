import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GeofenceIntroScreen() {
  const router = useRouter();

  return (
    <View >
      <Image source={require('@/assets/welcoming/welcom3.png')} style={styles.image} />
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={{ textAlign: 'center'}} >Know Where They Are. Always.</ThemedText>
      <ThemedText type="small"   style={{ textAlign: 'center'}} >Set up geofences to keep the herd safe and receive instant entry alerts.</ThemedText>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/onboarding/language-select')}>
          <ThemedText type="link" style={styles.buttonText}>
            Next
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  image: {
    width: 360,
    height: 400, 
    marginTop: -26,
  },
  actions: {
    marginTop: 24,
  },
  primaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: '#1A3C2A',
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
