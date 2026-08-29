import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Switch, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import ScreenContainer from '@/components/layout/screen-container';
import SectionHeader from '@/components/settings/section-header';
import SettingsRow from '@/components/settings/settings-row';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AppPressable } from '@/components/ui/pressable';
import { ErrorState } from '@/components/ui/states';
import { Space } from '@/constants/theme';
import { useUpdatePreferences } from '@/hooks/mutations/use-update-preferences';
import { useBaseStationStatus } from '@/hooks/queries/use-base-station-status';
import { usePreferences } from '@/hooks/queries/use-preferences';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useTheme } from '@/hooks/use-theme';
import { clearSession } from '@/services/api/client';
import type { Preferences } from '@/types/settings';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data: currentUser } = useCurrentUser();
  const { data: preferences, isError: preferencesError, refetch: refetchPreferences } = usePreferences();
  const { data: baseStationStatus } = useBaseStationStatus();
  const updatePreferencesMutation = useUpdatePreferences();
  const [draftVolume, setDraftVolume] = useState<number>(preferences?.alertVolume ?? 50);

  useEffect(() => {
    if (preferences?.alertVolume != null) {
      setDraftVolume(preferences.alertVolume);
    }
  }, [preferences?.alertVolume]);

  const label = currentUser?.name || currentUser?.userName || 'Herdos User';
  const location = currentUser?.location || 'Location not set';

  const onToggle = (key: keyof Preferences, value: boolean) => {
    updatePreferencesMutation.mutate({ [key]: value } as Partial<Preferences>);
  };

  const onSignOut = () => {
    Alert.alert('Sign out', 'You will need your phone number to sign back in.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll hasTabBar edges={['top']} contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <Image
          source={require('@/assets/images/logo-glow.png')}
          style={styles.logo}
          accessibilityLabel="HerdOS logo"
        />
        <AppPressable
          onPress={() => router.push('/settings/edit-profile')}
          accessibilityLabel="Edit profile"
          minTouchTarget={false}
        >
          <Avatar name={label} photoUrl={currentUser?.avatarUrl} size={48} />
        </AppPressable>
      </View>

      <Card variant="elevated">
        <View style={styles.profileHeader}>
          <View style={styles.profileText}>
            <ThemedText type="heading" numberOfLines={1}>
              {label}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {location}
            </ThemedText>
          </View>
          <Button
            size="sm"
            variant="outline"
            label="Edit Profile"
            onPress={() => router.push('/settings/edit-profile')}
          />
        </View>
      </Card>

      {/* Without this, a failed fetch renders as "everything is off" and is
          indistinguishable from a real off state. */}
      {preferencesError ? (
        <ErrorState
          title="Preferences unavailable"
          description="Your settings could not be loaded, so the switches below may not reflect reality."
          onRetry={refetchPreferences}
        />
      ) : null}

      <SectionHeader title="Preferences" />
      <SettingsRow
        icon="globe"
        label="Language"
        right={<ThemedText type="small" themeColor="textSecondary">{preferences?.language ?? 'en'}</ThemedText>}
        onPress={() => router.push('/settings/language')}
        chevron
      />
      <SettingsRow
        icon="bell"
        label="Notifications"
        right={
          <Switch
            value={preferences?.notifications ?? false}
            disabled={!preferences}
            onValueChange={(value) => onToggle('notifications', value)}
          />
        }
      />
      <SettingsRow
        icon="speaker"
        label="Audio Alerts"
        right={
          <Switch
            value={preferences?.audioAlerts ?? false}
            disabled={!preferences}
            onValueChange={(value) => onToggle('audioAlerts', value)}
          />
        }
      />
      <SettingsRow
        icon="volume"
        label="Alert Sound Volume"
        right={
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={draftVolume}
            disabled={!preferences}
            onValueChange={setDraftVolume}
            onSlidingComplete={(value) => updatePreferencesMutation.mutate({ alertVolume: value })}
          />
        }
      />

      <SectionHeader title="Device" />
      <SettingsRow
        icon="device"
        label="Base Station Status"
        right={
          <ThemedText
            type="smallBold"
            style={{ color: baseStationStatus?.connected ? theme.success : theme.danger }}
          >
            {baseStationStatus?.connected ? 'Connected' : 'Disconnected'}
          </ThemedText>
        }
      />
      <SettingsRow
        icon="battery"
        label="Collar Battery Alerts"
        right={
          <Switch
            value={preferences?.collarBatteryAlerts ?? false}
            disabled={!preferences}
            onValueChange={(value) => onToggle('collarBatteryAlerts', value)}
          />
        }
      />
      <SettingsRow
        icon="info"
        label="Device Diagnostics"
        onPress={() => router.push('/settings/device-diagnostics')}
        chevron
      />

      <SectionHeader title="About" />
      <SettingsRow icon="info" label="About HERDOS" onPress={() => router.push('/settings/about')} chevron />
      <SettingsRow
        icon="shield"
        label="Privacy Policy"
        onPress={() => router.push('/settings/privacy-policy')}
        chevron
      />
      <SettingsRow
        icon="globe"
        label="Version"
        right={
          <ThemedText type="small" themeColor="textSecondary">
            {Constants.expoConfig?.version ?? '1.0.0'}
          </ThemedText>
        }
      />

      <Button
        variant="dangerOutline"
        label="Sign out"
        onPress={onSignOut}
        fullWidth
        style={styles.signOut}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  logo: {
    width: 140,
    height: 36,
    resizeMode: 'contain',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  profileText: {
    flex: 1,
  },
  slider: {
    width: 140,
  },
  signOut: {
    marginTop: Space.xl,
  },
});
