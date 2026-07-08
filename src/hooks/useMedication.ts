import { getMedicationById } from "@/src/api/medications/api";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useEffect, useState } from "react";

export function useMedication(medicationId?: number) {
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!medicationId) {
      setMedication(null);
      setError("Missing medication.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const row = await getMedicationById(medicationId);
      setMedication(row);

      return row;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load medication";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [medicationId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    medication,
    loading,
    error,
    refetch,
  };
}