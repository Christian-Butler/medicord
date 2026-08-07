import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Vaccines() {

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-6">
                <View className="pl-8 pr-8 pt-12 ">
                    <Text className="text-2xl text-center">Have you received any vaccine ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">With a vaccine history you can keep track of what you're protected from.</Text>
                </View>
                <View className="flex-1 pt-12" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">Add a vaccine</Text>

                    </TouchableOpacity>
                </View>
                <View className="flex-1 pt-4" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I have not received any vaccine</Text>

                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>

    );
}
