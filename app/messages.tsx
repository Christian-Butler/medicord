import ChatList from "@/components/chat-list";
import ScreenHeader from "@/components/screen-header";
import { Colors, Sizes } from "@/constants/theme";
import { Search } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Messages() {

  const { t } = useTranslation();

  return (
    <SafeAreaProvider style={{ backgroundColor: Colors.bg1 }}>
      <ScreenHeader title={t(`messages.title`)} />
      <View
        style={styles.search}
        className="h-14 flex-row rounded-2xl border border-[#0D5175] items-center bg-white px-5"
      >
        <Search size={Sizes.h4} color={Colors.textMuted} />
        <Text className="ml-2 text-[16px] font-regular text-gray-500">{t("messages.search")}</Text>
      </View>
      <Text className="text-center text-[14px] font-regular">{t("messages.contactInfo")}</Text>
      <ChatList />
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