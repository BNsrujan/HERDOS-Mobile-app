import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Space } from '@/constants/theme';

export default function IllnessDetectionScreen() {
  const router = useRouter();

  return (
    <View >
    <Image source={require('@/assets/welcoming/welcom2.png')} style={styles.image} />
    <ThemedView style={styles.container} >
        <ThemedText type="title" style={{ textAlign: 'center' }}>
          Know Before It Gets Worse.
        </ThemedText>
        <ThemedText type="small" style={{ textAlign: 'center' }}>
          HerdOS detects illness before symptoms appear, so you can act early.
        </ThemedText>
        <View style={styles.actions}>
          <Button size="lg" label="Next" onPress={() => router.push('/onboarding/geofence-intro')} />
        </View>
    </ThemedView>
    </View>
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
    width: 370,
    height: 400, 
    marginTop: -24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
});
