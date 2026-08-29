import { StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Space } from '@/constants/theme';

// TODO: every section below is placeholder copy and must be replaced with real
// legal text before release.
const SECTIONS = [
  {
    heading: 'Data We Collect',
    body: 'HERDOS may collect account information, device metadata, and livestock-related telemetry necessary for operating the service.',
  },
  {
    heading: 'How We Use It',
    body: 'We use this information to provide alerts, diagnostics, and account management features.',
  },
  {
    heading: 'Data Sharing',
    body: 'We may share limited data with trusted service providers to support the app experience and reliability.',
  },
  {
    heading: 'Contact Us',
    body: 'Contact support for any privacy-related requests or questions.',
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer scroll edges={['bottom']} contentContainerStyle={styles.content}>
      {SECTIONS.map((section) => (
        <ThemedText key={section.heading} type="smallBold">
          {section.heading}
          {'\n'}
          <ThemedText type="small" themeColor="textSecondary">
            {section.body}
          </ThemedText>
        </ThemedText>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.lg,
  },
});
