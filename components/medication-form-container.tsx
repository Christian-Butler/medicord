import MedicationForm from "@/components/medication-form";
import { useCreateMedication } from "@/src/hooks/useCreateMedication";
import { useMedication } from "@/src/hooks/useMedication";
import { useUpdateMedication } from "@/src/hooks/useUpdateMedication";
import type { MedicationInput } from "@/src/types/medicationTypes";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

function parseMedicationId(value?: string) {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function MedicationFormContainer() {
  const { medicationId } = useLocalSearchParams<{
    medicationId?: string;
  }>();

  const medicationIdNumber = parseMedicationId(medicationId);
  const isEditing = !!medicationIdNumber;

  const {
    medication,
    loading,
    error: medicationError,
  } = useMedication(medicationIdNumber);

  const { create, creating, createError } = useCreateMedication();
  const { update, updating, updateError } = useUpdateMedication();

  async function handleSubmit(input: MedicationInput) {
    if (!input.name.trim()) return;
    if (isEditing && medicationIdNumber) {
      await update({ id: medicationIdNumber, ...input });
    } else {
      await create({
        name: input.name,
        no_specific_time: input.noSpecificTime ?? false,
        no_specific_hour: input.noSpecificHour ?? false,
        instructions: input.instructions ?? [],
        hours: input.hours ?? [],
        days_frequency: input.daysFrequency ?? [],
        months_duration: input.monthsDuration ?? 0,
        weeks_duration: input.weeksDuration ?? 0,
        days_duration: input.daysDuration ?? 0,
        morning_frequency: input.morningFrequency ?? 0,
        noon_frequency: input.noonFrequency ?? 0,
        evening_frequency: input.eveningFrequency ?? 0,
        frequency: input.frequency ?? null,
      });
    }
    router.back();
  }


  const visibleError =
    (isEditing ? medicationError : null) ?? createError ?? updateError;

  return (
    <View>
      {loading && isEditing ? (
        <Text className="mx-6 mt-5 text-[15px] text-black">
          Loading medication...
        </Text>
      ) : null}

      <MedicationForm
        medication={isEditing ? medication : null}
        saving={creating || updating}
        error={visibleError}
        onSubmit={handleSubmit}
      />
    </View>
  );
}