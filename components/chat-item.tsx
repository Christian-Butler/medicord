import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Chat = { id: string; text?: string };
type Props = { item: Chat };

export default function ChatItem({ item }: Props) {
    const router = useRouter();

    const openChatRoom = () => {
        router.push(`/chat-room?id=${item.id}`);
    };

    return (
        <View>
            <TouchableOpacity
                onPress={openChatRoom}
                className="flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 border-b border-b-[#BEC9CA] border-200"
            >
                <Image
                    source={require("@/assets/images/phillip.png")}
                    style={{ width: 40, height: 40 }}
                    className="rounded-full"
                />

                <View className="flex-1 gap-3">
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ fontSize: 16, fontWeight: 500 }}>Doctor Name</Text>
                        <Text style={{ fontSize: 14, color: "#006500" }}>Last Online Time</Text>
                    </View>
                    <Text style={{ fontSize: 16, color: "#3C4D4D" }}>{item?.text ?? "Chat Item"}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}