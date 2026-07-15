import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/src/context/AuthContext";
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';


export const unstable_settings = {
  anchor: 'index',
};
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
              <Stack.Screen name="specialist-page" options={{ headerShown: false }} />
              <Stack.Screen name="doctor-details" options={{ headerShown: false }} />
              <Stack.Screen name="book-appointment" options={{ headerShown: false }} />
              <Stack.Screen name="appointments" options={{ headerShown: false }} />
              <Stack.Screen name="appointment-details" options={{ headerShown: false }} />
              <Stack.Screen name="edit-appointment" options={{ headerShown: false }} />
              <Stack.Screen name="create-medication" options={{ headerShown: false }} />
              <Stack.Screen name="medication-details" options={{ headerShown: false }} />
              <Stack.Screen name="medications" options={{ headerShown: false }} />
              <Stack.Screen name="medication-formpage" options={{ headerShown: false }} />
              <Stack.Screen name="medication-routine" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="reset-password" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}