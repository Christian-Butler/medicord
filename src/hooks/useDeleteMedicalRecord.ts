import { deleteMedicalRecord } from "@/src/api/medical-records/api";
import { useCallback, useState } from "react";

export function useDeleteMedicalRecord(refetch?: () => void) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteMedicalRecord(id);
      if (refetch) refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete record";
      setDeleteError(message);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [refetch]);

  return { deleteRecord, deleting, deleteError };
}