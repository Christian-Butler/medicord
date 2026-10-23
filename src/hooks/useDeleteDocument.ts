import { deleteDocument } from "@/src/api/documents/api";
import type { MedicalDocument } from "@/src/types/documentTypes";
import { useCallback, useState } from "react";

export function useDeleteDocument(refetch?: () => Promise<MedicalDocument[]>) {
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const remove = useCallback(
    async (document: MedicalDocument) => {
      try {
        setDeleting(true);
        setDeleteError(null);

        await deleteDocument(document);

        if (refetch) await refetch();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete document";
        setDeleteError(message);
        throw err;
      } finally {
        setDeleting(false);
      }
    },
    [refetch]
  );

  return { remove, deleting, deleteError };
}