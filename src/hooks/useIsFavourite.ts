import { isFavouriteDoctor } from "@/src/api/doctors/favoritedoctors"
import { useEffect, useState } from "react";

export function useIsFavourite(doctorId: string) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const result = await isFavouriteDoctor(doctorId);
        setIsFavourite(result);
      } catch (err) {
        console.error("[useIsFavourite] failed:", err);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, [doctorId]);

  return { isFavourite, setIsFavourite, loading };
}