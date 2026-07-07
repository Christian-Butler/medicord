import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';


export const unstable_settings = {
  anchor: '(tabs)',
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name='cardiology'
              options={{
                title: "Cardiology",
                headerBackTitle: "Home",
              }}
            />
            <Stack.Screen
              name='doctor-details'
              options={{
                title: "Doctor Details",
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name='book-appointment'
              options={{
                title: "Appointment",
                headerBackTitle: 'Back',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}