import { Tabs } from 'expo-router';
import { Package, Home } from 'lucide-react-native';
import { colors } from '@/constants';

interface TabBarIconProps {
  color: string;
  size: number;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="receiving"
        options={{
          title: 'Receiving',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Package size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
