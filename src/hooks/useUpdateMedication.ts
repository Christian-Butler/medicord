import {
  updateMedication,
  type UpdateMedicationInput,
} from "@/src/api/medications/api";
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