import { toggleFavouriteDoctor } from "@/src/api/doctors/favoritedoctors";
import { useCallback, useState } from "react";

export function useToggleFavourite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async (doctorId: string) => {
    try {
      setLoading(true);
      setError(null);
      const isFavourite = await toggleFavouriteDoctor(doctorId);
      return isFavourite;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle favourite");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggle, loading, error };
}