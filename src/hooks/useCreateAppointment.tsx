import { setDemoSession } from "@/src/api/auth/demoSession";
import { supabase } from "@/supabase/supabase";
import type {
    Appointment,
    CreateAppointmentInput,
} from "@/src/types/appointmentTypes";
import { buildAppointmentDateTimes } from "@/src/utils/appointmentDateTime";
import { useState } from "react";

export function useCreateAppointment() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createAppointment(input: CreateAppointmentInput) {
    try {
      setCreating(true);
      setError(null);

      const user = await setDemoSession();

      if (!user?.id) {
        throw new Error("No authenticated user found");
      }

      const { starts_at, ends_at } = buildAppointmentDateTimes(
        input.selectedDate,
        input.selectedTime,
        input.durationMinutes ?? 30
      );

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          healthcare_service_id: input.healthcare_service_id ?? null,
          clinician_id: input.clinician_id,
          title: input.title ?? "Medical appointment",
          appointment_type: input.appointment_type ?? "consultation",
          location: input.location ?? null,
          starts_at,
          ends_at,
          status: "booked",
          reason: input.reason ?? null,
          notes: input.notes ?? null,
          patient_name: input.patient_name ?? null,
          patient_email: input.patient_email ?? null,
          patient_phone: input.patient_phone ?? null,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Appointment;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create appointment";

      console.error("[useCreateAppointment] failed:", err);
      setError(message);
      throw new Error(message);
    } finally {
      setCreating(false);
    }
  }

  return {
    createAppointment,
    creating,
    error,
  };
}