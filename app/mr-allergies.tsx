import ScreenHeader from "@/components/screen-header";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Allergies() {
    const params = useLocalSearchParams<{ addedAllergy?: string }>();
    const { records, refetch } = useMedicalRecords("allergies");
    const { create } = useCreateMedicalRecord();
    const { deleteRecord } = useDeleteMedicalRecord(refetch);

    useEffect(() => {
        if (params.addedAllergy) {
            const allergyToAdd = params.addedAllergy;
            router.setParams({ addedAllergy: undefined });

            create({
                category: "allergies",
                item: allergyToAdd,
                vaccineDate: null,
                operationDate: null,
                diagnosis: null,
                conditionState: null,
            })
                .then(() => refetch())
                .catch((err) => console.error("[Allergies] save failed:", err));
        }
    }, [params.addedAllergy]);

    return (
        <ScrollView className="bg-[#EEF9FB]">
            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-6 pr-6 pt-12">
                    <Text className="text-2xl text-center">Do you have any allergy ?</Text>
                </View>
                <View className="pl-2 pr-2 pt-4">
                    <Text className="text-base text-center">
                        Keep a trace of your allergies to improve medical follow-ups. It includes food, medication or anything else.
                    </Text>
                </View>

                <View className="flex-1 m-2 pt-12 mb-10">
                    <TouchableOpacity
                        className="flex-row justify-center bg-[#5085A8] h-14 mb-6 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "allergies" },
                        })}
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">Add an allergy</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {records.length > 0 && (
                <View className="mt-10">
                    {records.map((record) => (
                        <View key={record.id} className="mx-4 mt-4 px-4 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95]">
                            <View className="my-8 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <MaterialIcons name="gpp-maybe" size={44} color="#0D5175" />
                                    <Text className="pl-4 mt-2 font-medium text-xl mb-2">{record.item}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                                    <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}