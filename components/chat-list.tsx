import { Colors, Sizes } from "@/constants/theme";
import { type Conversation } from "@/src/api/messages/api";
import { useConversations } from "@/src/hooks/useConversation";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, View } from "react-native";
import ChatItem from "./chat-item";

export default function ChatList() {
  const { conversations, loading, error } = useConversations();

  const { t } = useTranslation();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ color: Colors.text, fontSize: Sizes.paragraph }}>{t(`chat-list.loading`)}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontSize: Sizes.paragraph, color: Colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: Sizes.h4 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      renderItem={({ item }) => <ChatItem item={item as Conversation} />}
    />
  );
}