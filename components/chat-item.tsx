import { type Conversation } from "@/src/api/messages/api";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

type Props = { item: Conversation };

export default function ChatItem({ item }: Props) {
    const { t } = useTranslation();
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/chat-room",
            params: { doctorId: item.doctor_id },
          })
        }
        className="flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 border-b border-b-[#BEC9CA]"
      >
        {item.doctors?.avatar_url ? (
          <Image
            source={{ uri: item.doctors.avatar_url }}
            style={{ width: 40, height: 40 }}
            className="rounded-full"
          />
        ) : (
          <View
            style={{ width: 40, height: 40 }}
            className="rounded-full bg-[#D7E8ED]"
          />
        )}

        <View className="flex-1 gap-3">
          <View className="flex-row justify-between">
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {item.doctors?.full_name ?? "Doctor"}
            </Text>
               {item.created_at ? (
              <Text style={{ fontSize: 14, color: "#006500" }}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            ) : null}
          </View>
          <Text style={{ fontSize: 16, color: "#3C4D4D" }}>
            {item.content || t(`chat-item.start`)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}