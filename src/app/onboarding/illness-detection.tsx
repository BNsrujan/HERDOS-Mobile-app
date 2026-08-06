import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function IllnessDetectionScreen() {
  const router = useRouter();

  return (
    <View >
    <Image source={require('@/assets/welcoming/welcom2.png')} style={styles.image} />
    <ThemedView style={styles.container} >
        <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
          Know Before It Gets Worse.
        </ThemedText>
        <ThemedText type="small" style={{ textAlign: 'center' }}>
          HerdOS detects illness before symptoms appear, so you can act early.
        </ThemedText>
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/onboarding/geofence-intro')}>
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
