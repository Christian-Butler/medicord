import { setDemoSession } from "@/src/api/auth/demoSession";
import type { Appointment } from "@/src/types/appointmentTypes";
import { supabase } from "@/supabase/supabase";
import { useCallback, useEffect, useState } from "react";

export function useAppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await setDemoSession();

      if (!user?.id) {
        throw new Error("No authenticated user found");
      }

      console.log("[useAppointmentList] user id:", user.id);

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          user_id,
          doctor_id,
          gp_id,
          referral_required,
          referral_status,
          title,
          appointment_type,
          location,
          starts_at,
          ends_at,
          status,
          reason,
          patient_name,
          patient_email,
          patient_phone,
          created_at,
          updated_at,
          doctors (
            id,
            full_name,
            specialty,
            clinic_name,
            location
          ),
          gps (
            id,
            full_name,
            practice_name,
          )
        `)
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .order("starts_at", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      console.log("[useAppointmentList] appointments:", data);

      setAppointments((data ?? []) as Appointment[]);
      return data as Appointment[];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load appointments";

      console.error("[useAppointmentList] failed:", err);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
}