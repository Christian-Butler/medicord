import { getDoctorById } from "@/src/api/doctors/api";
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

export function useDoctor(doctorId?: string) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!doctorId) {
      setDoctor(null);
      setError("Missing doctor.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const row = await getDoctorById(doctorId);

      setDoctor(row as Doctor);

      return row as Doctor;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load doctor";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    doctor,
    loading,
    error,
    refetch,
  };
}