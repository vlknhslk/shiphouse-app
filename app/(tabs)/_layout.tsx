import { Tabs } from 'expo-router';
import { Package2, ListChecks, QrCode } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#6B7280',
        headerTitleStyle: {
          fontFamily: 'Figtree-SemiBold',
        },
        tabBarLabelStyle: {
          fontFamily: 'Figtree-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Package2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="receiving"
        options={{
          title: 'Receiving',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="processing"
        options={{
          title: 'Processing',
          tabBarIcon: ({ color, size }) => <ListChecks size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}