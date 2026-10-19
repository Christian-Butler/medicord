import { getAvailableTimes } from "@/src/api/appointments/availability";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAvailableTimes(doctorId?: string, date?: string | null) {
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  const refetch = useCallback(async () => {
    if (!doctorId || !date) {
      setTimes([]);
      return;
    }

    // ignore results from an older request if the date changed meanwhile
    const requestId = ++latestRequest.current;

    try {
      setLoading(true);
      setError(null);
      const result = await getAvailableTimes(doctorId, date);
      if (requestId === latestRequest.current) setTimes(result);
    } catch (err) {
      if (requestId === latestRequest.current) {
        setError(err instanceof Error ? err.message : "Failed to load available times");
      }
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { times, loading, error, refetch };
}