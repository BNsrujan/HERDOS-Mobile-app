import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Space } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/favicon/web-app-manifest-512x512.png')} style={styles.image} />
      <ThemedText type="title" style={{ textAlign: 'center' }}>
        Welcome to HerdOS
      </ThemedText>
      <ThemedText type="small" style={{ textAlign: 'center' }}>
        Track your livestock health, location, and alerts in one app.
      </ThemedText>
      <View style={styles.actions}>
        <Button size="lg" label="Next" onPress={() => router.push('/onboarding/illness-detection')} />
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
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    
    objectFit: 'contain',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});
