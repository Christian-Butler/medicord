import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Documents() {

    return (

        <View className="flex-1 bg-[#EEF9FB]">

            <ScrollView className="flex-1">

                <ScreenHeader title='Documents' />


                <View className="m-6">

                    <View className="pt-4">
                        <Text className="text-xl">You’re the only one having access to the files and able to manage them.</Text>
                    </View>

                    <View className="pt-6 justify-between flex-row items-center">
                        <Text>2026 </Text>
                        <View className="w-80 h-0.5 bg-[#BEC9CA] rounded-full self-endline" />
                    </View>

                    <View className="flex-1 pt-6 flex-row items-center" >
                        <MaterialIcons name="assignment" size={44} color="#0D5175" />
                        <View className="pl-4">
                            <Text>Medication prescription</Text>
                            <View className="flex-row items-center  pt-2">
                                <Text className="text-[#3C4D4D]">Dr. John Doe </Text>
                                <MaterialIcons name="circle" size={6} color="#3C4D4D" />
                                <Text className="text-[#3C4D4D]"> February 12nd 2026</Text>
                            </View>
                        </View>

                        <View className="self-center pl-10">
                            <TouchableOpacity
                                className="justify-center p-1 border-2 border-[#0D5175] items-center rounded-full"
                                accessibilityRole="button"
                            >
                                <MaterialIcons name="more-horiz" size={18} color="#0D5175" ></MaterialIcons>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="pt-6 justify-between flex-row items-center">
                        <Text>2025 </Text>
                        <View className="w-80 h-0.5 bg-[#BEC9CA] rounded-full self-endline" />
                    </View>

                </View>


            </ScrollView>

            <TouchableOpacity className="absolute bottom-8 self-center flex-row px-5 mdc-fab flex-row bg-[#5085A8] h-14 items-center rounded-2xl elevation-5 shadow-md"
                accessibilityRole="button">
                <MaterialIcons className="border-2 rounded-full p-1 items-center border-[#fff]" name="add" color="#fff" />
                <Text className="text-[#fff] font-medium ml-2">Add a document</Text>
            </TouchableOpacity>

        </View>
    );
}
