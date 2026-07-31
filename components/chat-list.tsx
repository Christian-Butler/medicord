import React from "react";
import { FlatList, View } from "react-native";
import ChatItem from "./chat-item";

export default function ChatList() {

    const chats = [
        { id: '1', text: 'I received the test result, I will check them.' },
        { id: '2', text: 'Thank you you !' },
    ];

    return (
        <View className={"flex-1"} >
            <FlatList
                data={chats}
                contentContainerStyle={{ flex: 1, paddingVertical: 20 }}
                keyExtractor={(item, index) => (item.id ?? index).toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <ChatItem item={item} />}
            />
        </View>

    );
}
