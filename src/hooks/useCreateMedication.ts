import { createMedication } from "@/src/api/medications/api";
import type {
  Medication,
  MedicationInput,
} from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";

export function useCreateMedication(refetch?: () => Promise<Medication[]>) {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const create = useCallback(
    async (input: MedicationInput) => {
      try {
        setCreating(true);
        setCreateError(null);

        const row = await createMedication(input);

        if (refetch) await refetch();

        return row;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create medication";

        setCreateError(message);
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [refetch]
  );

  return {
    create,
    creating,
    createError,
  };
}