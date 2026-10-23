import { uploadDocument } from "@/src/api/documents/api";
import type { DocumentUploadInput, MedicalDocument } from "@/src/types/documentTypes";
import { useCallback, useState } from "react";

export function useUploadDocument(refetch?: () => Promise<MedicalDocument[]>) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = useCallback(
    async (input: DocumentUploadInput) => {
      try {
        setUploading(true);
        setUploadError(null);

        const document = await uploadDocument(input);

        if (refetch) await refetch();

        return document;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add document";
        setUploadError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [refetch]
  );

  return { upload, uploading, uploadError };
}