import { useConversations } from "@/src/hooks/useConversation";
import { type Conversation } from "@/src/api/messages/api";
import ChatItem from "./chat-item";
import React from "react";
import { FlatList, Text, View } from "react-native";

export default function ChatList() {
  const { conversations, loading, error } = useConversations();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[15px] text-black">Loading messages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[15px] text-[#B42318]">{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      renderItem={({ item }) => <ChatItem item={item as Conversation} />}
    />
  );
}