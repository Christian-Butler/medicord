import { useMessages } from "@/src/hooks/useMessages";
import React, { useEffect, useRef } from "react";
import { FlatList, Text, View } from "react-native";

export default function MessageList({ doctorId }: { doctorId: string }) {
  const { messages, loading, error } = useMessages(doctorId);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[15px] text-black">Loading...</Text>
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
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      onContentSizeChange={() =>
        flatListRef.current?.scrollToEnd({ animated: true })
      }
      renderItem={({ item }) => (
        <View
          className={`mx-4 my-1 max-w-[75%] rounded-2xl px-4 py-2 ${
            item.sent_by === "user"
              ? "self-end bg-[#5085A8]"
              : "self-start bg-white"
          }`}
        >
          <Text
            className={`text-[15px] ${
              item.sent_by === "user" ? "text-white" : "text-black"
            }`}
          >
            {item.content}
          </Text>
          <Text
            className={`mt-1 text-[11px] ${
              item.sent_by === "user" ? "text-white/70" : "text-[#888]"
            }`}
          >
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      )}
    />
  );
}