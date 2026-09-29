import RenewModal from "@/components/renew-modal";
import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function PrescriptionRenewal() {

    const [renewalModal, setRenewalModal] = useState(false);

    const { t } = useTranslation();

    return (

        <View className="flex-1 bg-[#fff]">
            <ScreenHeader title="Prescription renewal" />

            <RenewModal
                visible={renewalModal}
                onConfirm={() => { setRenewalModal(false) }}
                onClose={() => setRenewalModal(false)}
            />

            <ScrollView
                className="flex-1 bg-[#EEF9FB]"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="px-6 py-8">
                    <Text className="text-xl">You’re the only one having access to the files and able to manage them.</Text>
                </View>

                <View className="px-4">
                    <View className="justify-between flex-row items-center">
                        <Text>2026 </Text>
                        <View className="w-80 h-0.5 bg-[#BEC9CA] rounded-full self-endline" />
                    </View>

                    <View className="flex-1 pt-6 flex-row items-center" >
                        <MaterialIcons name="assignment" size={44} color="#0D5175" />
                        <View className="px-4">
                            <Text>Medication prescription</Text>
                            <View className="flex-row items-center  pt-2">
                                <Text className="text-[#3C4D4D]">Dr. John Doe </Text>
                                <MaterialIcons name="circle" size={6} color="#3C4D4D" />
                                <Text className="text-[#3C4D4D]"> February 12nd 2026</Text>
                            </View>
                        </View>
                        <View className="self-center">
                            <TouchableOpacity
                                onPress={() => setRenewalModal(true)}
                                className="justify-center px-6 py-3 bg-[#5085A8] items-center rounded-[12px]"
                                accessibilityRole="button"
                            >
                                <TouchableOpacity>
                                    <Text className="font-medium text-[16px] color-white">
                                        Ask
                                    </Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 pt-6 flex-row items-center" >
                        <MaterialIcons name="assignment" size={44} color="#0D5175" />
                        <View className="px-4">
                            <Text>Medication prescription</Text>
                            <View className="flex-row items-center  pt-2">
                                <Text className="text-[#3C4D4D]">Dr. John Doe </Text>
                                <MaterialIcons name="circle" size={6} color="#3C4D4D" />
                            </View>
                            <Text className="text-[#3C4D4D]"> February 12nd 2026</Text>
                        </View>
                        <View className="self-center pl-14">
                            <TouchableOpacity
                                className="justify-center px-6 py-3 bg-[#E0BB4D] items-center rounded-[12px]"
                                accessibilityRole="button"
                            >
                                <View>
                                    <Text className="font-medium text-[16px] color-black">
                                        Waiting
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-1 pt-6 flex-row items-center" >
                        <MaterialIcons name="assignment" size={44} color="#0D5175" />
                        <View className="px-4">
                            <Text>Medication prescription</Text>
                            <View className="flex-row items-center  pt-2">
                                <Text className="text-[#3C4D4D]">Dr. John Doe </Text>
                                <MaterialIcons name="circle" size={6} color="#3C4D4D" />
                            </View>
                            <Text className="text-[#3C4D4D]">February 12nd 2026</Text >
                        </View>
                        <View className="self-center pl-9">
                            <TouchableOpacity
                                className="justify-center px-6 py-3 bg-[#17A633] items-center rounded-[12px]"
                                accessibilityRole="button"
                            >
                                <View>
                                    <Text className="font-medium text-[16px] color-white">
                                        Approved
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="pt-6 justify-between flex-row items-center">
                        <Text>2025 </Text>
                        <View className="w-80 h-0.5 bg-[#BEC9CA] rounded-full self-endline" />
                    </View>

                </View>

            </ScrollView>

        </View>
    );
}