import { setDemoSession } from "@/src/api/auth/demoSession";
import { supabase } from "@/supabase/supabase";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useState } from "react";

export function useDeleteAppointment() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteAppointment(appointmentId: string) {
    try {
      setDeleting(true);
      setError(null);

      const user = await setDemoSession();

      if (!user?.id) {
        throw new Error("No authenticated user found");
      }

      const { data, error } = await supabase
        .from("appointments")
        .update({
          status: "cancelled",
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
        err instanceof Error ? err.message : "Failed to cancel appointment";

      console.error("[useDeleteAppointment] failed:", err);
      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  }

  return {
    deleteAppointment,
    deleting,
    error,
  };
}