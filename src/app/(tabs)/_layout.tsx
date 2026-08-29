import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import TabIcon from '@/components/ui/tab-icon';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const activeColor = theme.brand;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: theme.textSecondary,
        // Without this the tab bar stays React Navigation's default white in dark mode.
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          textTransform: 'none',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={focused ? activeColor : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="herd"
        options={{
          title: 'Herd',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="herd" color={focused ? activeColor : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="map" color={focused ? activeColor : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="alerts" color={focused ? activeColor : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="settings" color={focused ? activeColor : color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
