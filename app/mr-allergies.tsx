import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";

export default function Allergies() {
  const params = useLocalSearchParams<{ addedAllergy?: string }>();
  const { records, refetch } = useMedicalRecords("allergies");
  const { create } = useCreateMedicalRecord();
  const { deleteRecord } = useDeleteMedicalRecord(refetch);

  useEffect(() => {
    if (params.addedAllergy) {
      create({
        category: "allergies",
        item: params.addedAllergy,
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

        <View className="flex-1 m-2 pt-12">
          <TouchableOpacity
            className="flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
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
        <View className="mx-4 mt-20 px-4 py-2 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95]">
          {records.map((record) => (
            <View key={record.id} className="my-8 flex-row items-center justify-between">
              <View className="flex-row">
                <MaterialIcons name="gpp-maybe" size={44} color="#0D5175" />
                <View className="justify-start mx-8">
                  <Text className="font-medium text-xl mb-2">Allergy</Text>
                  <View>
                    <Text>{record.item}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}