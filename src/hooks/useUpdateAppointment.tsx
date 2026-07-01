import { setDemoSession } from "@/src/api/auth/demoSession";
import { supabase } from "@/supabase/supabase";
import type {
    Appointment,
    UpdateAppointmentInput,
} from "@/src/types/appointmentTypes";
import { useState } from "react";

export function useUpdateAppointment() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentInput
  ) {
    try {
      setUpdating(true);
      setError(null);

      const user = await setDemoSession();

      if (!user?.id) {
        throw new Error("No authenticated user found");
      }

      const { data, error } = await supabase
        .from("appointments")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Appointment;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update appointment";

      console.error("[useUpdateAppointment] failed:", err);
      setError(message);
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  }

  return {
    updateAppointment,
    updating,
    error,
  };
}