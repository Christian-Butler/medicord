import { useCreateAlarm } from "@/src/hooks/useCreateAlarm";
import { useDeleteMedication } from "@/src/hooks/useDeleteMedication";
import { useMedicationList } from "@/src/hooks/useMedicationList";
import { formatMedicationDuration } from "@/src/utils/medicationFormat";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MedicationContainer() {
  const { medications, loading, error, refetch } = useMedicationList();
  const { deleteById, deleting, deleteError } = useDeleteMedication(refetch);

  const { t } = useTranslation();

  const { handleCreateAlarm } = useCreateAlarm();

  useFocusEffect(
    useCallback(() => {
      refetch().catch(() => { });
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
        onPress={() => router.push("/medication-formpage")}
        className="h-[50px] flex-row items-center justify-center rounded-[14px] bg-[#5085A8]"
      >
        <Plus size={20} color="white" />

        <Text className="ml-2 text-[16px] font-medium text-white">
          {t(`medication-container.addRoutine`)}
        </Text>
      </Pressable>

      {loading ? (
        <Text className="mt-5 text-[16px] text-black">
          {t(`medication-container.loading`)}
        </Text>
      ) : null}

      {visibleError ? (
        <Text className="mt-5 text-[16px] text-[#B42318]">
          {t(`medication-container.${visibleError}`)}
        </Text>
      ) : null}

      {!loading && !visibleError && sortedMedications.length === 0 ? (
        <Text className="mt-5 text-[16px] text-black">
          {t(`medication-container.noRoutine`)}
        </Text>
      ) : null}

      {!loading && !visibleError && sortedMedications.length > 0 ? (
        <View className="mt-8">
          {sortedMedications.map((medication) => {
            const duration = formatMedicationDuration(

            );

            const instruction =
              medication.instructions && medication.instructions.length > 0
                ? medication.instructions[0]
                : t(`medication-container.instructions`);

            return (
              <View key={medication.id} className="mb-6 flex-row items-start bg-[white] px-4 pb-6 pt-2 rounded-3xl">

                <View className="mt-2 flex-1">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="medication" size={46} color="#075B7A" />
                    <View className="">
                      <Text className="text-[20px] font-medium text-black">
                        {medication.name ?? "Unnamed medication"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: "/medication-formpage",
                            params: {
                              medicationId: String(medication.id),
                            },
                          })
                        }
                        className="mr-8 flex-row items-center"
                      >
                        <MaterialIcons name="edit" size={20} color="#8A3F00" />

                        <Text className="ml-1 text-[16px] font-medium text-[#8A3F00]">
                          {t(`medication-container.edit`)}
                        </Text>
                      </Pressable>

                      <Pressable
                        className="items-center"
                        disabled={deleting}
                        onPress={() => handleDeleteMedication(medication.id)}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={24}
                          color="#E33434"
                        />
                      </Pressable>
                    </View>
                  </View>

                  <Text className="ml-2 mt-2 text-[16px] font-medium text-black">
                    {t(`medication-container.duration`)}
                  </Text>

                  <Text className="ml-2 mt-1 text-[16px] font-regular text-gray-600">
                    {duration}
                  </Text>

                  <Text className="ml-2 mt-4 text-[16px] font-regular text-black">
                    {instruction}
                  </Text>

                  <View className="ml-2 mt-2 flex-row flex-wrap gap-2">
                    {weekDays.map((day) => {
                      const selected = medication.days_frequency?.includes(day);

                      return (
                        <View
                          key={day}
                          className={`h-[38px] min-w-[40px] items-center justify-center rounded-[8px] border-[2px] border-[#0D5175] px-2 ${selected ? "bg-[#0D5175]" : "bg-white"
                            }`}
                        >
                          <Text
                            className={`text-[14px] font-medium ${selected ? "text-white" : "text-[#0D5175]"
                              }`}
                          >
                            {t(`medication-container.${day}`)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <View className="mt-8 flex-row items-center justify-between">
                    <Pressable className="px-6 py-4 items-center justify-center rounded-[12px] border-[2px] border-[#0D5175] bg-white">
                      <Text className="text-[16px] font-medium text-[#0D5175]">
                        {t(`medication-container.calendar`)}
                      </Text>
                    </Pressable>

                    <Pressable
                      className="h-[48px] items-center justify-center rounded-[10px] bg-[#5085A8] px-5"
                      onPress={() => {
                        if (!medication) return;
                        handleCreateAlarm(medication);
                      }}
                    >
                      <Text className="text-[16px] font-medium text-white">
                        {t(`medication-container.alarm`)}
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