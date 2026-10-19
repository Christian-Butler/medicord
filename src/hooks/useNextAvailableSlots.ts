import { getNextAvailableSlots } from "@/src/api/appointments/availability";
import { useEffect, useState } from "react";

export function useNextAvailableSlots(doctorIds: string[]) {
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // a stable key, so a new array with the same ids doesn't refetch
  const key = doctorIds.join(",");

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    if (ids.length === 0) {
      setSlots({});
      return;
    }

    let active = true;
    setError(null);

    getNextAvailableSlots(ids)
      .then((result) => {
        if (active) setSlots(result);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load availability");
      });

    return () => {
      active = false;
    };
  }, [key]);

  return { slots, error };
}