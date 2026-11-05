import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useAddMedicationToCalendar } from "@/src/hooks/useAddMedicationToCalendar";
import { useCreateAlarm } from "@/src/hooks/useCreateAlarm";
import { useDeleteMedication } from "@/src/hooks/useDeleteMedication";
import { useMedicationList } from "@/src/hooks/useMedicationList";
import { readRoutine } from "@/src/libs/medicationCalender";
import { formatMedicationDuration } from "@/src/utils/medicationFormat";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export default function MedicationContainer() {
  const { medications, loading, error, refetch } = useMedicationList();
  const { deleteById, deleting, deleteError } = useDeleteMedication(refetch);

  const { t } = useTranslation();
  const { addToCalendar, adding } = useAddMedicationToCalendar();
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
    <View
      style={{
        paddingHorizontal: Sizes.p3, paddingBottom: Sizes.IconNml, paddingTop: Sizes.h1
      }}>
      <Pressable
        onPress={() => router.push("/medication-formpage")}
        style={{
          height: Buttons.height, borderRadius: Sizes.p3, backgroundColor: Colors.primary
        }}
        className="flex-row items-center justify-center"
      >
        <Plus size={Sizes.h4} color={Colors.bg2} />

        <Text
          style={{ marginLeft: Sizes.p0, fontSize: Sizes.paragraph, fontWeight: '500', color: Colors.bg2 }}>
          {t(`medication-container.addRoutine`)}
        </Text>
      </Pressable>

      {loading ? (
        <Text
          style={{ fontSize: Sizes.paragraph, color: Colors.text, marginTop: Sizes.p2 }}>
          {t(`medication-container.loading`)}
        </Text>
      ) : null}

      {visibleError ? (
        <Text
          style={{ fontSize: Sizes.paragraph, color: Colors.text, marginTop: Sizes.p2 }}>
          {t(`medication-container.${visibleError}`)}
        </Text>
      ) : null}

      {!loading && !visibleError && sortedMedications.length === 0 ? (
        <Text
          style={{ fontSize: Sizes.paragraph, color: Colors.text, marginTop: Sizes.p2 }}>
          {t(`medication-container.noRoutine`)}
        </Text>
      ) : null}

      {!loading && !visibleError && sortedMedications.length > 0 ? (
        <View
          style={{ marginTop: Sizes.h1 }}>
          {sortedMedications.map((medication) => {
            const duration = formatMedicationDuration(
              medication.date_start ?? new Date(),
              medication.date_end ?? new Date()
            );
            const { days, windows, hours } = readRoutine(medication);
            const instructions = (medication.instructions ?? []).filter(Boolean);
            const selectedWindows = medication.no_specific_time ? [] : windows;
            const selectedHours = medication.no_specific_time ? [] : hours;

            return (
              <View key={medication.id}
                style={{
                  marginBottom: Sizes.p2,
                  backgroundColor: Colors.bg2,
                  paddingHorizontal: Sizes.p3,
                  paddingBottom: Sizes.paragraph,
                  borderRadius: Sizes.p3
                }}
                className="flex-row items-start">

                <View
                  style={{ marginTop: Sizes.p2 }}
                  className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <MaterialIcons name="medication" size={Sizes.IconLg} color={Colors.secondary} />
                    <View className="">
                      <Text
                        style={{ fontSize: Sizes.h4, color: Colors.text }}
                        className="font-medium">
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
                        style={{ marginRight: Sizes.paragraph }}
                        className="flex-row items-center"
                      >
                        <MaterialIcons name="edit" size={Sizes.h4} color={Colors.edit} />

                        <Text
                          style={{ marginLeft: Sizes.p0, fontSize: Sizes.paragraph, color: Colors.edit }}
                          className="font-medium">
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
                          size={Sizes.h2 - 2}
                          color={Colors.delete}
                        />
                      </Pressable>
                    </View>
                  </View>

                  <Text
                    style={{ marginLeft: Sizes.p1, marginTop: Sizes.p1, fontSize: Sizes.paragraph, color: Colors.text }}
                    className="font-medium">
                    {t(`medication-container.duration`)}
                  </Text>

                  <Text
                    style={{ marginLeft: Sizes.p1, marginTop: Sizes.p1, fontSize: Sizes.paragraph, color: Colors.textMuted }}
                    className="font-regular">
                    {duration}
                  </Text>

                  {days.length > 0 ? (
                    <View
                      style={{ marginLeft: Sizes.p1, marginTop: Sizes.p1 }}
                      className="flex-row flex-wrap gap-2">
                      {days.map((day) => (
                        <View
                          key={day}
                          style={{ height: Buttons.imgW, borderRadius: Sizes.p2, borderWidth: Buttons.w1, borderColor: Colors.secondary, paddingHorizontal: Sizes.p1 }}
                          className="min-w-[42px] items-center justify-center bg-[#0D5175]"
                        >
                          <Text
                            style={{ fontSize: Sizes.sm }}
                            className="font-medium text-white"
                          >
                            {t(`medication-container.${day}`)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  <Text style={{ marginLeft: Sizes.p1, marginTop: Sizes.p2, fontSize: Sizes.paragraph, color: Colors.text }}>
                    {medication.frequency ? t(`medication-container.${medication.frequency}`) : ""}
                  </Text>

                  {selectedWindows.length > 0 ? (
                    <Text style={{ marginLeft: Sizes.p1, marginTop: Sizes.p1, fontSize: Sizes.paragraph, color: Colors.text }}>
                      {selectedWindows.map((window) => t(`medication-container.${window}`)).join(", ")}
                    </Text>
                  ) : null}

                  {selectedHours.length > 0 ? (
                    <Text style={{ marginLeft: Sizes.p1, marginTop: Sizes.p1, fontSize: Sizes.paragraph, color: Colors.text }}>
                      {selectedHours.join(", ")}
                    </Text>
                  ) : null}

                  {instructions.length > 0 ? (
                    <Text style={{ marginLeft: Sizes.p1, marginTop: Sizes.p1, fontSize: Sizes.paragraph, color: Colors.text }}>
                      {instructions.join("\n")}
                    </Text>
                  ) : null}

                  <View
                    style={{ marginTop: Sizes.h2 }}
                    className="flex-row items-center justify-between">
                    <Pressable disabled={adding}
                      onPress={() => addToCalendar(medication)}
                      style={{
                        paddingHorizontal: Sizes.p3,
                        height: Buttons.height,
                        borderRadius: Sizes.p3,
                        borderWidth: Buttons.w2,
                        borderColor: Colors.secondary,
                        backgroundColor: Colors.bg2
                      }}
                      className="items-center justify-center">
                      <Text
                        style={{ fontSize: Sizes.paragraph, fontWeight: '500', color: Colors.secondary }}>
                        {t(`medication-container.calendar`)}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={{ height: Buttons.height, borderRadius: Sizes.p3, backgroundColor: Colors.primary, paddingHorizontal: Sizes.h5 }}
                      className="items-center justify-center"
                      onPress={() => {
                        if (!medication) return;
                        handleCreateAlarm(medication);
                      }}
                    >
                      <Text
                        style={{ fontSize: Sizes.paragraph, fontWeight: '500', color: Colors.bg2 }}>
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