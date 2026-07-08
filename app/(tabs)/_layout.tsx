
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
          tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
          headerShown: false,
          tabBarButton: HapticTab,

          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            height: 100,
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
            title: "Appointments",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="calendar-month" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="medical-records"
          options={{
            title: "Records",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="archive" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="medication"
          options={{
            title: "Medication",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="medication" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="person.crop.circle.fill"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
