import { getMyPrescriptions } from "@/src/api/prescriptions/api";
import type { Prescription } from "@/src/types/prescriptionTypes";
import { useCallback, useRef, useState } from "react";

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const refetch = useCallback(async () => {
    try {
      // Only show the loading state the first time, not on every refocus.
      if (!hasLoaded.current) setLoading(true);
      setError(null);

      const rows = await getMyPrescriptions();
      setPrescriptions(rows);
      hasLoaded.current = true;

      return rows;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load prescriptions";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { prescriptions, loading, error, refetch };
}
