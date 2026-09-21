import { getFavouriteDoctors } from "@/src/api/doctors/favoritedoctors";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useFavouriteDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFavouriteDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`useFavoriteDoctors.fail`));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, error, refetch: fetchDoctors };
}