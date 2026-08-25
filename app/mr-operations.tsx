import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";

export default function Operations() {
  const { records, refetch } = useMedicalRecords("operations");
  const { deleteRecord } = useDeleteMedicalRecord(refetch);

  return (
    <ScrollView className="bg-[#EEF9FB]">
      <ScreenHeader title='' />

      <View className="m-6">
        <View className="pt-12">
          <Text className="text-2xl text-center">Have you had medical surgery</Text>
        </View>
        <View className="pl-4 pr-4 pt-4">
          <Text className="text-base text-center">
            Keep a trace of your medical surgeries for an improved medical follow-up.
          </Text>
        </View>
        <View className="flex-1 pt-12">
          <TouchableOpacity
            className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
            accessibilityRole="button"
            onPress={() => router.push({
              pathname: "/mr-search-history",
              params: { category: "operations" },
            })}
          >
            <MaterialIcons name="add" size={26} color="#fff" />
            <Text className="text-base text-center text-[#fff] font-medium">Add a surgery</Text>
          </TouchableOpacity>
        </View>

        {records.length > 0 && (
          <View className="mt-6 px-4 py-2 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95]">
            {records.map((record) => (
              <View key={record.id} className="my-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialIcons name="local-hospital" size={36} color="#0D5175" />
                  <View className="ml-4">
                    <Text className="font-medium text-base">{record.item}</Text>
                    {record.operation_date ? (
                      <Text className="text-sm text-[#555]">{record.operation_date}</Text>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                  <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}