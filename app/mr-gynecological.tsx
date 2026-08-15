import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Gynecology() {

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-4 pt-6">
                    <Text className="text-2xl font-medium">My gynecological follow-up</Text>
                </View>

                <View className="flex-1 mt-8 h-28" >
                    <TouchableOpacity
                        className="flex-1 flex-row border-2 bg-[#E1F9FF] border-[#326F95] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <View className="flex-row items-center">
                            <MaterialIcons className="p-2" name="medication" size={44} color="#0D5175" />
                            <View>
                                <Text className="text-base text-xl font-medium">Contraceptives</Text>
                                <Text className="pt-2 text-base">Not specified</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>

                <View className="flex-1 mt-8 h-28" >
                    <TouchableOpacity
                        className="flex-1 flex-row border-2 bg-[#E1F9FF] border-[#326F95] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <View className="flex-row items-center">
                            <MaterialIcons className="p-2" name="pregnant-woman" size={44} color="#0D5175" />
                            <View>
                                <Text className="text-base text-xl font-medium">Pregnancy</Text>
                                <Text className="pt-2 text-base">Not specified</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>

                <View className="flex-1 mt-8 h-28" >
                    <TouchableOpacity
                        className="flex-1 flex-row border-2 bg-[#E1F9FF] border-[#326F95] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <View className="flex-row items-center">
                            <MaterialIcons className="p-2" name="female" size={44} color="#0D5175" />
                            <View>
                                <Text className="text-base text-xl font-medium">Menopause</Text>
                                <Text className="pt-2 text-base">Not specified</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>

    );
}