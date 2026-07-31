import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";


type Chat = { id: string; text?: string };
type Props = { item: Chat };


export default function ChatList({ item }: Props) {

    return (
        <View>

            <TouchableOpacity className="flex-row justify-between mx-4 item-center gap-3 mb-4 pb-2 border-b border-b-[#BEC9CA] border-200">

                <Image source={require('/Users/marysiamtw/Documents/Project Develop/medicord/assets/images/phillip.png')}
                    style={{ width: 40, height: 40 }}
                    className="rounded-full"
                />

                {/* Name and last  message*/}

                <View className={"flex-1 gap-3"}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: 500 }}>Doctor Name</Text>
                        <Text style={{ fontSize: 14, color: '#006500' }}>Last Online Time</Text>
                    </View>
                    <Text style={{ fontSize: 16, color: '#3C4D4D' }}>{item?.text ?? "Chat Item"}</Text>
                </View>
            </TouchableOpacity>

        </View>
    );
}