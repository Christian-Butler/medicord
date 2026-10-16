import { getMyMedications } from "@/src/api/medications/api";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useRef, useState } from "react";

export function useMedicationList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const refetch = useCallback(async () => {
    try {
      if (!hasLoaded.current) setLoading(true);
      setError(null);

      const rows = await getMyMedications();
      setMedications(rows);
      hasLoaded.current = true;

      return rows;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load medications";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    medications,
    loading,
    error,
    refetch,
  };
}