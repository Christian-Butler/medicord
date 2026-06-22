import { supabase } from "@/supabase/supabase";


export async function createAppointment(input: {
  clinicianId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  reason?: string;
  startsAt: string;
  endsAt: string;
  location?: string;
}) {
  const now = new Date().toISOString();

  const { error } = await supabase.from("appointments").insert({
    user_id: null,
    healthcare_service_id: null,
    clinician_id: input.clinicianId,

    title: `Appointment for ${input.patientName}`,
    appointment_type: "consultation",
    location: input.location ?? null,

    starts_at: input.startsAt,
    ends_at: input.endsAt,

    status: "pending",
    reason: input.reason ?? null,
    notes: null,

    patient_name: input.patientName,
    patient_email: input.patientEmail,
    patient_phone: input.patientPhone ?? null,

    created_at: now,
    updated_at: now,
  });

  if (error) throw error;

  return {
    status: "pending",
    startsAt: input.startsAt,
    endsAt: input.endsAt,
  };
}
