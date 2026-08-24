import ChatList from "@/components/chat-list";
import ScreenHeader from "@/components/screen-header";
import { Search } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Messages() {
  return (
    <SafeAreaProvider style={{ backgroundColor: "#EEF9FB" }}>
      <ScreenHeader title="Messages" />
      <ScrollView>
        <View>
          <View
            style={styles.search}
            className="h-14 flex-row rounded-2xl border-2 items-center border-[#778888] bg-white px-5"
          >
            <Search size={18} color="#778888" />
          </View>
          <ChatList />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  search: {
    width: 350,
    marginBottom: 20,
    alignSelf: "center",
    marginTop: "4%",
  },
});