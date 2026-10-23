import {
  updateMedication,
  type UpdateMedicationInput,
} from "@/src/api/medications/api";
import { syncMedicationAlarms } from "@/src/libs/medicationAlarms";
import { syncMedicationCalendar } from "@/src/libs/medicationCalender";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";

export function useUpdateMedication(refetch?: () => Promise<Medication[]>) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const update = useCallback(
    async (input: UpdateMedicationInput) => {
      try {
        setUpdating(true);
        setUpdateError(null);

        const row = await updateMedication(input);

        // Only does anything if the user sent this medication to the calendar / set an alarm.
        await syncMedicationCalendar(row).catch((err) =>
          console.warn("Calendar sync failed", err)
        );
        await syncMedicationAlarms(row).catch((err) =>
          console.warn("Alarm sync failed", err)
        );

        if (refetch) await refetch();

        return row;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update medication";

        setUpdateError(message);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [refetch]
  );

  return {
    update,
    updating,
    updateError,
  };
}