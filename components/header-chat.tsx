import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type HeaderChatProps = {
    title: string;
    onPhonePress?: () => void;
    onVideoPress?: () => void;
    showBack?: boolean;
    onBackPress?: () => void;
    rightElement?: React.ReactNode;
    backgroundColor?: string;
    style?: ViewStyle;
};

export default function HeaderChat({
    title,
    onPhonePress = () => { },
    onVideoPress = () => { },
    showBack = true,
    onBackPress,
    rightElement,
    backgroundColor = "#fff",
    style,
}: HeaderChatProps) {
    function handleBackPress() {
        if (onBackPress) {
            onBackPress();
            return;
        }

        router.back();
    }
    return (
        <View className="bg-white h-120">
            <View style={[styles.header, { backgroundColor }, style]}>
                <View style={styles.side}>
                    {showBack ? (
                        <Pressable
                            accessibilityRole="button"
                            onPress={handleBackPress}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="chevron-left" size={34} color="#000" />
                        </Pressable>
                    ) : null}
                </View>
                <View className="flex-row items-center pt-51">
                    <Image
                        source={require("@/assets/images/phillip.png")}
                        className="h-10 w-10 rounded-full"
                    />
                    <Text className="ml-3 text-[18px] font-medium text-[#233238]">{title}</Text>
                </View>

                <View className="flex-row items-center">
                    <Pressable
                        onPress={onPhonePress}
                        className="mr-3 rounded-full bg-[#5085A8] p-2"
                    >
                        <MaterialIcons name="phone" size={20} color="#fff" />
                    </Pressable>

                    <Pressable
                        onPress={onVideoPress}
                        className="rounded-full bg-[#5085A8] p-2"
                    >
                        <MaterialIcons name="video-call" size={20} color="#fff" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 120,
        paddingTop: '14%',
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: "#003454",
    },

    side: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    backButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "500",
        color: "#000",
    },
});