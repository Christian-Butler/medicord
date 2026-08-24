import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function MedicalHistory() {

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-6">
                <View className="pl-8 pr-8 pt-12 ">
                    <Text className="text-2xl text-center">Any medical history concerning the family ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">Indicating medical family history may help you in detecting the appearance of various health conditions such as diabetes, asthma or a cancer.</Text>
                </View>
                <View className="flex-1 pt-12" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "family_medical_history" },
                        })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="font-medium text-center text-[#fff] font-medium">Add family medical history</Text>

                    </TouchableOpacity>
                </View>
                {/* <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-medium text-center text-[#5085A8] font-medium">My family has no medical history</Text>

                    </TouchableOpacity>
                </View>
                */}

                <View className="mt-16 h-0.5 bg-[#BEC9CA] rounded-full" />
                <View className="pl-4 pr-4 pt-16">
                    <Text className="text-2xl text-center">Any personal medical history ?</Text>
                </View>

                <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "personal_medical_history" },
                        })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-medium text-center text-[#fff] font-medium">Add personal medical history</Text>

                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>

    );
}
