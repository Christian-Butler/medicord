import ScreenHeader from "@/components/screen-header";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function MedicalHistory() {
    const { records: familyRecords, refetch: refetchFamily } = useMedicalRecords("family_medical_history");
    const { records: personalRecords, refetch: refetchPersonal } = useMedicalRecords("personal_medical_history");
    const { deleteRecord: deleteFamilyRecord } = useDeleteMedicalRecord(refetchFamily);
    const { deleteRecord: deletePersonalRecord } = useDeleteMedicalRecord(refetchPersonal);

    return (
        <ScrollView className="bg-[#EEF9FB]">
            <ScreenHeader title='' />

            <View className="m-6">
                <View className="pl-8 pr-8 pt-12">
                    <Text className="text-2xl text-center">Any medical history concerning the family ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">
                        Indicating medical family history may help you in detecting the appearance of various health conditions such as diabetes, asthma or a cancer.
                    </Text>
                </View>
                <View className="flex-1 pt-12">
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "family_medical_history" },
                        })}
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="font-medium text-center text-[#fff]">Add family medical history</Text>
                    </TouchableOpacity>
                </View>

                {familyRecords.length > 0 && (
                    <View className="mt-4">
                        {familyRecords.map((record) => (
                            <View key={record.id} className="mt-4 px-4 py-2 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95]">
                                <View className="my-4 flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="medical-information" size={36} color="#0D5175" />
                                        <View className="ml-4">
                                            <Text className="font-medium text-xl mb-1">{record.item}</Text>
                                            {record.family_diagnosis ? (
                                                <View className="flex-row">
                                                    <Text className="text-base font-medium text-black">Diagnosed at: </Text>
                                                    <Text className="text-base text-gray-800">{record.family_diagnosis} years old</Text>
                                                </View>
                                            ) : null}
                                            {record.family_member ? (
                                                <View className="flex-row">
                                                    <Text className="text-base font-medium text-black">Relationship: </Text>
                                                    <Text className="text-base text-gray-800">{record.family_member}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteFamilyRecord(record.id)}>
                                        <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View className="mt-16 h-0.5 bg-[#BEC9CA] rounded-full" />

                <View className="pl-4 pr-4 pt-16">
                    <Text className="text-2xl text-center">Any personal medical history ?</Text>
                </View>
                <View className="flex-1 pt-8">
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "personal_medical_history" },
                        })}
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-center text-[#fff] font-medium">Add personal medical history</Text>
                    </TouchableOpacity>
                </View>

                {personalRecords.length > 0 && (
                    <View className="mt-4">
                        {personalRecords.map((record) => (
                            <View key={record.id} className="mt-4 px-4 py-2 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95]">
                                <View className="my-4 flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="medical-information" size={36} color="#0D5175" />
                                        <View className="ml-4">
                                            <Text className="font-medium text-xl mb-1">{record.item}</Text>
                                            {record.diagnosis ? (
                                                <View className="flex-row">
                                                    <Text className="text-base font-medium text-black">Diagnosed: </Text>
                                                    <Text className="text-base text-gray-800">{record.diagnosis}</Text>
                                                </View>
                                            ) : null}
                                            {record.condition_state ? (
                                                <View className="flex-row">
                                                    <Text className="text-base font-medium text-black">State: </Text>
                                                    <Text className="text-base text-gray-800">{record.condition_state}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => deletePersonalRecord(record.id)}>
                                        <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}