
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

const BLUE = "#09516D";
const INACTIVE = "#8A9BA3";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,

          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            height: 140,
            borderTopColor: "#FFFFFF",
            borderTopWidth: 2,
            paddingTop: 20,
            paddingBottom: 12,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            headerShown: true,
            title: "Appointments",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="calendar-month" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="medical-records"
          options={{
            headerShown: true,
            title: "Records",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="archive" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="medication"
          options={{
            headerShown: true,
            title: "Medication",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="medication" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: true,
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                size={28}
                name="account-circle"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View >
  );
}
