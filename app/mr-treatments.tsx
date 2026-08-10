import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Treatments() {

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-8 pr-8 pt-12 ">
                    <Text className="text-2xl text-center">Is there any treatment you are regularly taking ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">Keeping a trace of the treatments you follow reduces oversights and improves medical follow-ups.</Text>
                </View>
                <View className="flex-1 m-2 pt-12" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">Add a treatment</Text>

                    </TouchableOpacity>
                </View>
                <View className="flex-1  m-2 pt-4" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I am not taking any treatment</Text>

                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>

    );
}