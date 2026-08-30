import 'react-native-gesture-handler';
import '@/global.css';
import '@/services/i18n';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ApiError, setUnauthorizedHandler } from '@/services/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx will not resolve by retrying, and retrying it three times with backoff
      // makes every failing screen take ~5s to show its error state.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 30,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.clear();
      router.replace('/(auth)/login');
    });
    return () => setUnauthorizedHandler(null);
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
                <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="animal/[id]" />
                <Stack.Screen name="animal/new" options={{ presentation: 'modal' }} />
                <Stack.Screen name="animal/trends" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="zones" />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
