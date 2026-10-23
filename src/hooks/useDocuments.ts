import { getMyDocuments } from "@/src/api/documents/api";
import type { MedicalDocument } from "@/src/types/documentTypes";
import { useCallback, useRef, useState } from "react";

export function useDocuments() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const refetch = useCallback(async () => {
    try {
      // Only show the loading state the first time, not on every refocus.
      if (!hasLoaded.current) setLoading(true);
      setError(null);

      const rows = await getMyDocuments();
      setDocuments(rows);
      hasLoaded.current = true;

      return rows;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load documents";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, loading, error, refetch };
}