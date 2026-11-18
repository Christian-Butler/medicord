import ChatList from "@/components/chat-list";
import ScreenHeader from "@/components/screen-header";
import { Colors, Inputs, Sizes } from "@/constants/theme";
import { Search } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Messages() {

  const { t } = useTranslation();

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.bg1 }}>
      <ScreenHeader title={t(`messages.title`)} />
      <View
        style={{
          height: Inputs.height,
          width: Sizes.width - 50,
          marginBottom: Sizes.h5,
          alignSelf: "center",
          marginTop: Sizes.h5,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: Sizes.p3,
          borderWidth: 1,
          borderColor: Colors.secondary,
          backgroundColor: Colors.bg2,
          paddingHorizontal: Sizes.p2,
        }}
      >
        <Search size={Sizes.h4} color={Colors.textMuted} />
        <Text style={{ marginLeft: Sizes.p2, fontSize: Sizes.paragraph, color: Colors.textMuted }}>
          {t("messages.search")}
        </Text>
      </View>
      <Text style={{ textAlign: "center", fontSize: Sizes.sm }}>{t("messages.contactInfo")}</Text>
      <ChatList />
    </SafeAreaProvider>
  );
}