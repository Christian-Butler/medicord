import { BottomSheetHub } from '@/components/bottom-sheet';
import { HapticTab } from '@/components/haptic-tab';
import SpecialTabButton from '@/components/special-tab-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import BottomSheet from '@gorhom/bottom-sheet';
import { Tabs } from 'expo-router';
import { useRef } from 'react';
import { View } from 'react-native';


const BLUE = "#09516D";
const INACTIVE = "#8A9BA3";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null!);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 100,
            borderTopColor: '#0a7ea4',
            borderTopWidth: 2,
            paddingTop: 20,
          }
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="prescriptions"
          options={{
            href: null,
            title: 'Prescriptions',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="pills.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name='services-hub'
          options={{
            title: 'Services hub',
            tabBarButton: () => (
              <SpecialTabButton onPress={() => bottomSheetRef.current?.expand()} title='Services hub' />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
          }}
        />
      </Tabs>
      <BottomSheetHub bottomSheetRef={bottomSheetRef} />
    </View>
  );
}