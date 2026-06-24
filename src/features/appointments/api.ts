import { supabase } from "@/supabase/supabase";

export type CreateAppointmentInput = {
  clinicianId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  reason?: string;
  startsAt: string;
  endsAt: string;
  location?: string;
};

export type UpdateAppointmentInput = {
  id: string;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  reason?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
};

export async function createAppointment(input: CreateAppointmentInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in to book an appointment.");

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      user_id: user.id,
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
    })
    .select(
      `
      id,
      clinician_id,
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
      clinicians (
        id,
        full_name,
        specialty,
        clinic_name,
        location
      )
    `,
    )
    .single();

  if (error) throw error;

  return data;
}

export async function getMyAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      clinician_id,
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
      clinicians (
        id,
        full_name,
        specialty,
        clinic_name,
        location
      )
    `,
    )
    .order("starts_at", { ascending: true });

  if (error) throw error;

  return data;
}

export async function updateAppointment(input: UpdateAppointmentInput) {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.patientName !== undefined) patch.patient_name = input.patientName;
  if (input.patientEmail !== undefined)
    patch.patient_email = input.patientEmail;
  if (input.patientPhone !== undefined)
    patch.patient_phone = input.patientPhone;
  if (input.reason !== undefined) patch.reason = input.reason;
  if (input.startsAt !== undefined) patch.starts_at = input.startsAt;
  if (input.endsAt !== undefined) patch.ends_at = input.endsAt;
  if (input.location !== undefined) patch.location = input.location;

  const { data, error } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", input.id)
    .select(
      `
      id,
      clinician_id,
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
      clinicians (
        id,
        full_name,
        specialty,
        clinic_name,
        location
      )
    `,
    )
    .single();

  if (error) throw error;

  return data;
}

export async function cancelAppointment(id: string) {
  const { data, error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      `
      id,
      clinician_id,
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
      clinicians (
        id,
        full_name,
        specialty,
        clinic_name,
        location
      )
    `,
    )
    .single();

  if (error) throw error;

  return data;
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (error) throw error;
}