import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import TabIcon from '@/components/ui/tab-icon';
import { Colors } from '@/constants/theme';

const ACTIVE_TAB_COLOR = '#1A3C2A';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const theme = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_TAB_COLOR,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Jakarta Sans',
          fontSize: 12,
          textTransform: 'none',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={focused ? ACTIVE_TAB_COLOR : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="herd"
        options={{
          title: 'Herd',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="herd" color={focused ? ACTIVE_TAB_COLOR : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="map" color={focused ? ACTIVE_TAB_COLOR : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="alerts" color={focused ? ACTIVE_TAB_COLOR : color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="settings" color={focused ? ACTIVE_TAB_COLOR : color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
