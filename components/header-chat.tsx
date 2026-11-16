import { Colors } from "@/constants/theme";
import { useDoctor } from "@/src/hooks/useDoctor";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type HeaderChatProps = {
    title: string;
    doctorId?: string;
    onPhonePress?: () => void;
    onVideoPress?: () => void;
    showBack?: boolean;
    backgroundColor?: string;
    onBackPress?: () => void;
    rightElement?: React.ReactNode;
    style?: ViewStyle;
};

export default function HeaderChat({
    title,
    doctorId,
    showBack = true,
    onBackPress,
    rightElement,
    backgroundColor = Colors.bg2,
    style,
}: HeaderChatProps) {
    function handleBackPress() {
        if (onBackPress) {
            onBackPress();
            return;
        }

        router.back();
    }

    const { doctor } = useDoctor(doctorId);
    const avatar = doctor?.avatar_url || null;

    return (
        <View className="bg-white h-120">
            <View style={[styles.header, { backgroundColor }, style]}
                className="justify-between">
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
                    <View className="flex-row items-center pt-51">
                        {avatar ? (
                            <Image source={{ uri: avatar }} className="h-10 w-10 rounded-full" />
                        ) : (
                            <View className="h-10 w-10 rounded-full bg-[#D7E8ED]" />
                        )}
                        <Text className="ml-3 text-[18px] font-medium text-[#233238]">{doctor?.full_name ?? title}</Text>
                    </View>
                </View>
                <View style={styles.side}>
                    {rightElement ? rightElement : null}
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
        borderBottomWidth: 1,
        borderBottomColor: "#003454",
        backgroundColor: "pink",
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