import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Avatar from '@/components/herd/avatar';
import ScreenContainer from '@/components/layout/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppPressable } from '@/components/ui/pressable';
import { Space } from '@/constants/theme';
import { useUpdateProfile } from '@/hooks/mutations/use-update-profile';
import { useUploadAvatar } from '@/hooks/mutations/use-upload-avatar';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  // useState only reads its initializer on first render, so seeding from
  // currentUser directly left the fields blank whenever the query resolved later.
  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name ?? currentUser.userName ?? '');
    setLocation(currentUser.location ?? '');
    setLocalAvatarUri(currentUser.avatarUrl);
  }, [currentUser]);

  const phone = useMemo(() => currentUser?.phone ?? currentUser?.phoneNO ?? '', [currentUser]);

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library access is needed to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const uri = result.assets[0].uri;
    setLocalAvatarUri(uri);
    setError(null);

    uploadAvatarMutation.mutate(uri, {
      onSuccess: (data) => setLocalAvatarUri(data.avatarUrl),
      onError: () => setError("Couldn't upload that photo. Please try again."),
    });
  }

  async function handleSave() {
    setError(null);
    try {
      await updateProfileMutation.mutateAsync({
        name: name.trim() || undefined,
        location: location.trim() || undefined,
        avatarUrl: localAvatarUri,
      });
      router.back();
    } catch {
      setError("Couldn't save your profile. Please try again.");
    }
  }

  return (
    <ScreenContainer scroll edges={['bottom']} contentContainerStyle={styles.content}>
      <AppPressable
        onPress={handlePickAvatar}
        accessibilityLabel="Change profile photo"
        minTouchTarget={false}
        style={styles.avatarButton}
      >
        <Avatar name={name || currentUser?.userName || 'H'} photoUrl={localAvatarUri} size={120} />
        {uploadAvatarMutation.isPending ? <ActivityIndicator style={styles.loader} /> : null}
      </AppPressable>

      <Input label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
      <Input label="Location" value={location} onChangeText={setLocation} />

      <View style={styles.fieldGroup}>
        <ThemedText type="small" themeColor="textSecondary">
          Phone
        </ThemedText>
        <ThemedText type="body">{phone || 'Unavailable'}</ThemedText>
      </View>

      {error ? (
        <ThemedText type="small" themeColor="danger">
          {error}
        </ThemedText>
      ) : null}

      <Button
        size="lg"
        fullWidth
        label="Save profile"
        loading={updateProfileMutation.isPending}
        onPress={handleSave}
        style={styles.save}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Space.xl,
  },
  avatarButton: {
    alignSelf: 'center',
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  fieldGroup: {
    gap: Space.xs,
  },
  save: {
    marginTop: Space.sm,
  },
});
