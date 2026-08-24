import CustomKeyboardView from "@/components/custom-keyboard-view";
import HeaderChat from "@/components/header-chat";
import MessageList from "@/components/message-list";
import { useSendMessage } from "@/src/hooks/useSendMessage";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function ChatRoom() {
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const [input, setInput] = useState("");
  const { send, sending } = useSendMessage(doctorId);

  async function handleSend() {
    if (!input.trim()) return;
    await send(input.trim());
    setInput("");
  }

  return (
    <CustomKeyboardView inChat={true}>
      <View style={{ backgroundColor: "#EEF9FB" }} className="flex-1">
        <HeaderChat title="Doctor's name" />
        <View style={{ paddingHorizontal: "4%" }} />
        <View className="flex-1 justify-between">
          <View className="flex-1 overflow-visible">
            <MessageList doctorId={doctorId} />
          </View>
          <View
            style={{ height: 120, paddingHorizontal: "4%" }}
            className="pt-2 bg-neutral-100"
          >
            <View className="flex-row justify-between bg-white border p-2 border-[#586A6A] rounded-full pl-5">
              <TextInput
                placeholder="Type message..."
                style={{ fontSize: 16 }}
                className="flex-1 mr-2"
                value={input}
                onChangeText={setInput}
                editable={!sending}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={sending}
                className="p-2 mr-[1px]"
              >
                <MaterialIcons name="send" size={18} color="#586A6A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}