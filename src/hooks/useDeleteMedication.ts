import { deleteMedication } from "@/src/api/medications/api";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";

export function useDeleteMedication(refetch?: () => Promise<Medication[]>) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteById = useCallback(
    async (id: number) => {
      try {
        setDeleting(true);
        setDeleteError(null);

        await deleteMedication(id);

        if (refetch) await refetch();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete medication";

        setDeleteError(message);
        throw err;
      } finally {
        setDeleting(false);
      }
    },
    [refetch]
  );

  return {
    deleteById,
    deleting,
    deleteError,
  };
}