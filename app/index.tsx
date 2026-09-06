import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#EEF9FB]">
        <ActivityIndicator color="#075B7A" />
      </View>
    );
  }

  return session ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}