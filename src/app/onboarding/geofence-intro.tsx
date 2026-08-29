import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Space } from '@/constants/theme';

export default function GeofenceIntroScreen() {
  const router = useRouter();

  return (
    <View >
      <Image source={require('@/assets/welcoming/welcom3.png')} style={styles.image} />
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ textAlign: 'center'}} >Know Where They Are. Always.</ThemedText>
      <ThemedText type="small"   style={{ textAlign: 'center'}} >Set up geofences to keep the herd safe and receive instant entry alerts.</ThemedText>
      <View style={styles.actions}>
        <Button size="lg" label="Next" onPress={() => router.push('/onboarding/language-select')} />
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
});
