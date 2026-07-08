import { getDoctorsBySpecialty } from "@/src/api/doctors/api";
import { useCallback, useEffect, useState } from "react";

type Doctor = {
  id: string;
  full_name: string;
  specialty: string | null;
  bio?: string | null;
  clinic_name?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  rating?: number | null;
  years_experience?: number | null;
  requires_gp_referral?: boolean | null;
  is_active?: boolean | null;
};

export function useDoctorsBySpecialty(specialty?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!specialty) {
      setDoctors([]);
      setError("Missing specialty.");
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      const rows = await getDoctorsBySpecialty(specialty);

      setDoctors(rows as Doctor[]);

      return rows as Doctor[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load doctors";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [specialty]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    doctors,
    loading,
    error,
    refetch,
  };
}