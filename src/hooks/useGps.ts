import { getGps } from "@/src/api/gps/api";
import type { Gp } from "@/src/types/gpTypes";
import { useCallback, useEffect, useState } from "react";

export function useGps() {
  const [gps, setGps] = useState<Gp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rows = await getGps();

      setGps(rows);

      return rows;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load GPs";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch().catch(() => {});
  }, [refetch]);

  return {
    gps,
    loading,
    error,
    refetch,
  };
}