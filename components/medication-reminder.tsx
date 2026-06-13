import { Plus } from "lucide-react-native";
import { View, Pressable, Text } from "react-native";

export default function MedicationReminders() {
  return (
    <View className="px-6 pt-8">
      <Text className="text-[28px] font-normal text-black">Medication</Text>

      <Pressable className="mt-5 h-[58px] flex-row items-center justify-center rounded-2xl border-[3px] border-[#09516D] bg-white">
        <Plus size={30} color="#09516D" />

        <Text className="ml-3 text-[19px] font-medium text-[#09516D]">
          Add medication routine
        </Text>
      </Pressable>
    </View>
  );
}
