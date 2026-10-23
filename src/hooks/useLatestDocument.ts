import { getLatestDocument } from "@/src/api/documents/api";
import type { MedicalDocument } from "@/src/types/documentTypes";
import { useCallback, useRef, useState } from "react";

export function useLatestDocument() {
  const [document, setDocument] = useState<MedicalDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const hasLoaded = useRef(false);

  const refetch = useCallback(async () => {
    try {
      if (!hasLoaded.current) setLoading(true);
      const latest = await getLatestDocument();
      setDocument(latest);
      hasLoaded.current = true;
      return latest;
    } finally {
      setLoading(false);
    }
  }, []);

  return { document, loading, refetch };
}