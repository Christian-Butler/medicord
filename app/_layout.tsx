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
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            {/* <Stack.Screen
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
            <Stack.Screen
              name='medication-routine'
              options={{
                title: "Create Routine",
                headerBackTitle: 'Back',
              }}
            />
            /> */}
            <Stack.Screen name="specialist-page" options={{ headerShown: false }} />
            <Stack.Screen name="doctor-details" options={{ headerShown: false }} />
            <Stack.Screen name="book-appointment" options={{ headerShown: false }} />
            <Stack.Screen name="appointments" options={{ headerShown: false }} />
            <Stack.Screen name="appointment-details" options={{ headerShown: false }} />
            <Stack.Screen name="edit-appointment" options={{ headerShown: false }} />
            <Stack.Screen name="medication-routine" options={{ headerShown: false }} />
            <Stack.Screen name="medication-page" options={{ headerShown: false }} />
            <Stack.Screen name="medical-records" options={{ headerShown: false }} />
            <Stack.Screen name="messages" options={{ headerShown: false }} />
            <Stack.Screen name="chat-room" options={{ headerShown: false }} />
            <Stack.Screen name="mr-documents" options={{ headerShown: false }} />
            <Stack.Screen name="mr-history" options={{ headerShown: false }} />
            <Stack.Screen name="mr-treatments" options={{ headerShown: false }} />
            <Stack.Screen name="mr-vaccines" options={{ headerShown: false }} />
            <Stack.Screen name="mr-allergies" options={{ headerShown: false }} />
            <Stack.Screen name="mr-gynecological" options={{ headerShown: false }} />
            <Stack.Screen name="mr-operations" options={{ headerShown: false }} />
            <Stack.Screen name="mr-lifestyle" options={{ headerShown: false }} />
            <Stack.Screen name="mr-measurements" options={{ headerShown: false }} />
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}