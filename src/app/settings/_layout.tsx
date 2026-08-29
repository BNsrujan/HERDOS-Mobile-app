import { Stack } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';

/**
 * One file gives every /settings/* screen a native header, a back affordance and a
 * top inset - previously they were pushed under a Slot with none of those.
 */
export default function SettingsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Settings',
        headerTintColor: theme.textPrimary,
        headerStyle: { backgroundColor: theme.background },
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="language" options={{ title: 'Language' }} />
      <Stack.Screen name="device-diagnostics" options={{ title: 'Device Diagnostics' }} />
      <Stack.Screen name="about" options={{ title: 'About HerdOS' }} />
      <Stack.Screen name="privacy-policy" options={{ title: 'Privacy Policy' }} />
    </Stack>
  );
}
