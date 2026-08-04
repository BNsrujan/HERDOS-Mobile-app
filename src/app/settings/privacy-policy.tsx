import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Privacy Policy</ThemedText>

        <ThemedText type="smallBold">Data We Collect</ThemedText>
        <ThemedText type="small">
          {/* TODO: Replace with real legal copy. */}
          HERDOS may collect account information, device metadata, and livestock-related telemetry necessary for operating the service.
        </ThemedText>

        <ThemedText type="smallBold">How We Use It</ThemedText>
        <ThemedText type="small">
          {/* TODO: Replace with real legal copy. */}
          We use this information to provide alerts, diagnostics, and account management features.
        </ThemedText>

        <ThemedText type="smallBold">Data Sharing</ThemedText>
        <ThemedText type="small">
          {/* TODO: Replace with real legal copy. */}
          We may share limited data with trusted service providers to support the app experience and reliability.
        </ThemedText>

        <ThemedText type="smallBold">Contact Us</ThemedText>
        <ThemedText type="small">
          {/* TODO: Replace with real legal copy. */}
          Contact support for any privacy-related requests or questions.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 12,
  },
});
