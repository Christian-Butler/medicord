import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type RenewModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function RenewModal({ visible, onConfirm, onClose }: RenewModalProps) {

    const [reason, setReason] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');


    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 items-center justify-center bg-black/30 px-8">
                <View className="w-full rounded-[18px] bg-[#EEF9FB] px-6 py-10">
                    <Pressable onPress={onClose} className="absolute right-4 top-4 p-2">
                        <MaterialIcons name="close" size={22} color="#9BA8AB" />
                    </Pressable>
                    <View className="mt-4">
                        <Text className="text-center text-[20px] font-medium leading-7 text-black">
                            Why do you want to renew your prescription ?
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            placeholder="Reason"
                            placeholderTextColor={"#8F9D9E"}
                            keyboardType="phone-pad"
                            className="mt-8 h-[50px] rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
                        />
                    </View>
                    <View className="flex-row justify-between mt-6">
                        <TextInput
                            value={start}
                            onChangeText={setStart}
                            placeholder="Start"
                            placeholderTextColor={"#8F9D9E"}
                            keyboardType="phone-pad"
                            className="h-[50px] w-40 rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
                        />
                        <TextInput
                            value={end}
                            onChangeText={setEnd}
                            placeholder="End"
                            placeholderTextColor={"#8F9D9E"}
                            keyboardType="phone-pad"
                            className="h-[50px] w-40 rounded-[14px] border-[2px] border-[#9BA8AB] bg-white px-4 text-[16px] text-black"
                        />
                    </View>
                    <Pressable
                        onPress={onConfirm}
                        className="mt-8 h-[52px] items-center justify-center rounded-[14px] bg-[#5085A8]"
                    >
                        <Text className="text-[16px] font-semibold text-white">Ask 'Doctor Name'</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}