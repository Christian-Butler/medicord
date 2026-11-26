import { getAvailableDates } from "@/src/api/appointments/availability";
import { useEffect, useState } from "react";

export function useAvailableDates(doctorId?: string, fromDate?: string | null) {
  const [availableDates, setAvailableDates] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId || !fromDate) {
      setAvailableDates(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setAvailableDates(null);
    setError(null);
    getAvailableDates(doctorId, fromDate)
      .then((dates) => {
        if (!cancelled) setAvailableDates(dates);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load available dates",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, fromDate]);
  return { availableDates, error };
}
