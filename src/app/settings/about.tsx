import Constants from 'expo-constants';
import { Image, StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Space } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <ScreenContainer scroll edges={['bottom']} contentContainerStyle={styles.content}>
      <Image
        source={require('@/assets/images/logo-glow.png')}
        style={styles.logo}
        accessibilityLabel="HerdOS logo"
      />
      <ThemedText type="body">
        {/* TODO: Replace with the real app description copy. */}
        HERDOS helps farmers monitor livestock health, alerts, and device status in one place.
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Version {Constants.expoConfig?.version ?? '1.0.0'}
      </ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.lg,
  },
  logo: {
    width: 160,
    height: 40,
    resizeMode: 'contain',
  },
});
