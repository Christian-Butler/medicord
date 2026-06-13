import { Tabs } from "expo-router";
import React from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";

const BLUE = "#09516D";
const INACTIVE = "#8A9BA3";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: INACTIVE,

        tabBarStyle: {
          height: 82,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 3,
          borderTopColor: BLUE,
          paddingTop: 10,
          paddingBottom: 12,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 34 : 32}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          title: "Hub",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 34 : 32}
              name="cross.case"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 34 : 32} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
