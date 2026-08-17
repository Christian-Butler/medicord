import { useDeleteMedication } from "@/src/hooks/useDeleteMedication";
import { useMedicationList } from "@/src/hooks/useMedicationList";
import { formatMedicationDuration } from "@/src/utils/medicationFormat";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MedicationContainer() {
  const { medications, loading, error, refetch } = useMedicationList();
  const { deleteById, deleting, deleteError } = useDeleteMedication(refetch);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const visibleError = error ?? deleteError;
  const sortedMedications = [...medications].sort((a, b) => a.id - b.id);

  async function handleDeleteMedication(id: number) {
    try {
      await deleteById(id);
    } catch (err) {
      console.error("[MedicationContainer] delete failed:", err);
    }
  }

  return (
    <View className="px-6 pb-28 pt-8">
      <Pressable
        onPress={() => router.push("/medication-routine")}
        className="h-[44px] flex-row items-center justify-center rounded-[8px] border-[2px] border-[#0D5175] bg-white"
      >
        <Plus size={20} color="#0D5175" />

        <Text className="ml-2 text-[14px] font-medium text-[#0D5175]">
          Add medication routine
        </Text>
      </Pressable>

      {loading ? (
        <Text className="mt-5 text-[15px] text-black">
          Loading medications...
        </Text>
      ) : null}

      {visibleError ? (
        <Text className="mt-5 text-[15px] text-[#B42318]">
          {visibleError}
        </Text>
      ) : null}

      {!loading && !visibleError && sortedMedications.length === 0 ? (
        <Text className="mt-5 text-[15px] text-black">
          No medication routines yet.
        </Text>
      ) : null}

      {!loading && !visibleError && sortedMedications.length > 0 ? (
        <View className="mt-8">
          {sortedMedications.map((medication) => {
            const duration = formatMedicationDuration(
              medication.months_duration,
              medication.weeks_duration,
              medication.days_duration
            );

            const instruction =
              medication.instructions && medication.instructions.length > 0
                ? medication.instructions[0]
                : "No instructions added";

            return (
              <View key={medication.id} className="mb-12 flex-row items-start">
                <MaterialIcons name="medication" size={58} color="#075B7A" />

                <View className="ml-5 flex-1">
                  <View className="flex-row items-start justify-between">
                    <Text className="max-w-[150px] text-[25px] font-medium text-black">
                      {medication.name ?? "Unnamed medication"}
                    </Text>

                    <View className="flex-row items-center">
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/medication-routine",
                            params: {
                              medicationId: String(medication.id),
                            },
                          })
                        }
                        className="mr-5 flex-row items-center"
                      >
                        <MaterialIcons name="edit" size={19} color="#8A3F00" />

                        <Text className="ml-1 text-[18px] font-medium text-[#8A3F00]">
                          Edit
                        </Text>
                      </Pressable>

                      <Pressable
                        disabled={deleting}
                        onPress={() => handleDeleteMedication(medication.id)}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={28}
                          color="#E33434"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <Text className="mt-5 text-[25px] font-medium text-black">
                    Duration of treatment
                  </Text>

                  <Text className="mt-1 text-[18px] font-normal text-black">
                    {duration}
                  </Text>

                  <Text className="mt-5 text-[25px] font-normal text-black">
                    {instruction}
                  </Text>

                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {weekDays.map((day) => {
                      const selected = medication.days_frequency?.includes(day);

                      return (
                        <View
                          key={day}
                          className={`h-[38px] min-w-[40px] items-center justify-center rounded-[8px] border-[2px] border-[#0D5175] px-2 ${
                            selected ? "bg-[#0D5175]" : "bg-white"
                          }`}
                        >
                          <Text
                            className={`text-[14px] font-medium ${
                              selected ? "text-white" : "text-[#0D5175]"
                            }`}
                          >
                            {day}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <View className="mt-14 flex-row justify-end">
                    <Pressable className="mr-4 h-[48px] items-center justify-center rounded-[10px] border-[2px] border-[#2D7195] bg-white px-4">
                      <Text className="text-[18px] font-medium text-[#2D7195]">
                        Send to Calendar
                      </Text>
                    </Pressable>

                    <Pressable className="h-[48px] items-center justify-center rounded-[10px] bg-[#5085A8] px-5">
                      <Text className="text-[18px] font-medium text-white">
                        Create Alarm
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}