import HeaderChat from "@/components/header-chat";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function ChatRoom() {
    const item = useLocalSearchParams();
    console.log('item data received', item);

    return (
        <SafeAreaProvider style={{ backgroundColor: '#EEF9FB' }}>
            <HeaderChat title="Doctor's name" />
            <View>
            </View>
        </SafeAreaProvider>

    );
}


