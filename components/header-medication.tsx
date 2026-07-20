import React from "react";
import { Text, View } from "react-native";

export default function MedicationHeader() {
  return (
    <View className="bg-white ">
      <View className="items-center justify-between px-3 pt-8 pb-4">
        <Text className="ml-7 mr-7 text-2xl font-regular text-black">
          Medication
        </Text>
      </View>

      <View className="h-1 bg-[#09516D]" />
    </View >
  );
}
