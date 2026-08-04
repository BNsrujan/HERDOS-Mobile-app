import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useUpdateProfile } from '@/hooks/mutations/use-update-profile';
import { useUploadAvatar } from '@/hooks/mutations/use-upload-avatar';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const [name, setName] = useState(currentUser?.name ?? currentUser?.userName ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | undefined>(currentUser?.avatarUrl);

  const phone = useMemo(() => currentUser?.phone ?? currentUser?.phoneNO ?? '', [currentUser]);

  async function handlePickAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
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

    uploadAvatarMutation.mutate(uri, {
      onSuccess: (data) => {
        setLocalAvatarUri(data.avatarUrl);
      },
    });
  }

  async function handleSave() {
    await updateProfileMutation.mutateAsync({
      name: name.trim() || undefined,
      location: location.trim() || undefined,
      avatarUrl: localAvatarUri,
    });
    router.back();
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Edit Profile</ThemedText>

        <Pressable style={styles.avatarButton} onPress={handlePickAvatar}>
          {localAvatarUri ? (
            <Image source={{ uri: localAvatarUri }} style={styles.avatar} />
          ) : (
            <ThemedView style={styles.avatarPlaceholder} type="backgroundElement">
              <ThemedText type="subtitle">{(name || currentUser?.userName || 'H')[0]?.toUpperCase() ?? 'H'}</ThemedText>
            </ThemedView>
          )}
          {uploadAvatarMutation.isPending ? <ActivityIndicator style={styles.loader} /> : null}
        </Pressable>

        <View style={styles.fieldGroup}>
          <ThemedText type="smallBold">Name</ThemedText>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText type="smallBold">Location</ThemedText>
          <TextInput value={location} onChangeText={setLocation} style={styles.input} />
        </View>

        <View style={styles.fieldGroup}>
          <ThemedText type="smallBold">Phone</ThemedText>
          <ThemedText type="small" style={styles.phoneText}>{phone || 'Unavailable'}</ThemedText>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={updateProfileMutation.isPending}>
          <ThemedText type="smallBold" style={styles.saveButtonText}>
            {updateProfileMutation.isPending ? 'Saving…' : 'Save profile'}
          </ThemedText>
        </Pressable>
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
    gap: 18,
  },
  avatarButton: {
    alignSelf: 'center',
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundElement,
  },
  loader: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  fieldGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  phoneText: {
    color: '#6B7280',
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});
