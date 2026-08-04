import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import SectionHeader from '@/components/settings/section-header';
import SettingsRow from '@/components/settings/settings-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUpdatePreferences } from '@/hooks/mutations/use-update-preferences';
import { useBaseStationStatus } from '@/hooks/queries/use-base-station-status';
import { usePreferences } from '@/hooks/queries/use-preferences';
import { useCurrentUser } from '@/hooks/use-current-user';
import type { Preferences } from '@/types/settings';

export default function SettingsScreen() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const { data: preferences } = usePreferences();
  const { data: baseStationStatus } = useBaseStationStatus();
  const updatePreferencesMutation = useUpdatePreferences();
  const [draftVolume, setDraftVolume] = useState<number>(preferences?.alertVolume ?? 50);

  useEffect(() => {
    if (preferences?.alertVolume != null) {
      setDraftVolume(preferences.alertVolume);
    }
  }, [preferences?.alertVolume]);

  const avatarSource = currentUser?.avatarUrl ? { uri: currentUser.avatarUrl } : undefined;
  const label = currentUser?.name || currentUser?.userName || 'Herdos User';
  const location = currentUser?.location || 'Location not set';

  const onToggle = (key: keyof Preferences, value: boolean) => {
    updatePreferencesMutation.mutate({ [key]: value } as Partial<Preferences>);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <ThemedText type="title">HERODOS</ThemedText>
          <Pressable onPress={() => router.push('/settings/edit-profile' as never)}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <ThemedView style={styles.avatarPlaceholder}>
                <ThemedText type="smallBold">{label.charAt(0).toUpperCase()}</ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </View>

        <ThemedView style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View>
              <ThemedText type="subtitle">{label}</ThemedText>
              <ThemedText type="small" style={styles.locationText}>{location}</ThemedText>
            </View>
            <Pressable style={styles.outlineButton} onPress={() => router.push('/settings/edit-profile' as never)}>
              <ThemedText type="smallBold">Edit Profile</ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        <SectionHeader title="Preferences" />
        <SettingsRow
          icon="globe"
          label="Language"
          right={<ThemedText type="small">{preferences?.language ?? 'en'}</ThemedText>}
          onPress={() => router.push('/settings/language' as never)}
          chevron
        />
        <SettingsRow
          icon="bell"
          label="Notifications"
          right={<Switch value={preferences?.notifications ?? false} onValueChange={(value) => onToggle('notifications', value)} />}
        />
        <SettingsRow
          icon="speaker"
          label="Audio Alerts"
          right={<Switch value={preferences?.audioAlerts ?? false} onValueChange={(value) => onToggle('audioAlerts', value)} />}
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
              onValueChange={(value) => {
                setDraftVolume(value);
              }}
              onSlidingComplete={(value) => {
                updatePreferencesMutation.mutate({ alertVolume: value });
              }}
            />
          }
        />

        <SectionHeader title="Device" />
        <SettingsRow
          icon="device"
          label="Base Station Status"
          right={<ThemedText type="smallBold" style={baseStationStatus?.connected ? styles.connected : styles.disconnected}>{baseStationStatus?.connected ? 'Connected' : 'Disconnected'}</ThemedText>}
        />
        <SettingsRow
          icon="battery"
          label="Collar Battery Alerts"
          right={<Switch value={preferences?.collarBatteryAlerts ?? false} onValueChange={(value) => onToggle('collarBatteryAlerts', value)} />}
        />
        <SettingsRow
          icon="info"
          label="Device Diagnostics"
          onPress={() => router.push('/settings/device-diagnostics' as never)}
          chevron
        />

        <SectionHeader title="About" />
        <SettingsRow
          icon="info"
          label="About HERDOS"
          onPress={() => router.push('/settings/about' as never)}
          chevron
        />
        <SettingsRow
          icon="shield"
          label="Privacy Policy"
          onPress={() => router.push('/settings/privacy-policy' as never)}
          chevron
        />
        <SettingsRow
          icon="globe"
          label="Version"
          right={<ThemedText type="small">{Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>}
        />
      </ScrollView>
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
    paddingBottom: 48,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    padding: 16,
    borderRadius: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  outlineButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111827',
  },
  locationText: {
    color: '#6B7280',
  },
  slider: {
    width: 140,
  },
  connected: {
    color: '#22C55E',
  },
  disconnected: {
    color: '#EF4444',
  },
});
