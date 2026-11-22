import { Colors, Sizes } from "@/constants/theme";
import { type Conversation } from "@/src/api/messages/api";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
        style={{ borderBottomColor: Colors.dark.icon }}
        className="flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 border-b "
      >
        {item.doctors?.avatar_url ? (
          <Image
            source={{ uri: item.doctors.avatar_url }}
            style={{ width: 40, height: 40 }}
            className="rounded-full"
          />
        ) : (
          <View
            style={{ width: 40, height: 40, backgroundColor: Colors.primary }}
            className="rounded-full"
          />
        )}

        <View className="flex-1 gap-2">
          <View className="flex-row justify-between">
            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500" }}>
              {item.doctors?.full_name ?? "Doctor"}
            </Text>
            {item.created_at ? (
              <Text style={{ fontSize: Sizes.sm, color: Colors.secondary }}>
                {new Date(item.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            ) : null}
          </View>
          <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>
            {item.content || t(`chat-item.start`)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}