import ScreenHeader from "@/components/screen-header";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Vaccines() {
    const { records, refetch } = useMedicalRecords("vaccines");
    const { deleteRecord } = useDeleteMedicalRecord(refetch);

    return (
        <ScrollView className="bg-[#EEF9FB]">
            <ScreenHeader title="" />

            <View className="m-6">
                <View className="pl-8 pr-8 pt-12">
                    <Text className="text-2xl text-center">Have you received any vaccine ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">
                        With a vaccine history you can keep track of what you're protected from.
                    </Text>
                </View>

                <View className="flex-1 pt-12">
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl mb-20"
                        accessibilityRole="button"
                        onPress={() =>
                            router.push({
                                pathname: "/mr-search-history",
                                params: { category: "vaccines" },
                            })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">
                            Add a vaccine
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 
                <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I have not received any vaccine</Text>

                    </TouchableOpacity>
                </View>
                */}
            </View>{records.length > 0 && (
                <View className=" mx-6 mb-10">
                    {records.map((record) => (
                        <View
                            key={record.id}
                            className="px-4 py-6 mb-4 flex-row items-center justify-between rounded-2xl border-2 border-[#326F95]"
                        >
                            <MaterialIcons name="vaccines" size={44} color="#0D5175" />
                            <View className="flex-1 px-4">
                                <Text className="font-medium text-xl mb-1">{record.item}</Text>
                                {record.vaccine_date ? (
                                    <View className="flex-row">
                                        <Text className="text-base font-medium text-black">Received: </Text>
                                        <Text className="text-base text-gray-800 mt-1">{record.vaccine_date} </Text>
                                    </View>
                                ) : null}
                            </View>
                            <TouchableOpacity
                                onPress={() => deleteRecord(record.id)}
                                className="mr-4" >
                                <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}