import { supabase } from "@/supabase/supabase";
import type {
  Appointment,
  AppointmentInput,
} from "@/src/types/appointmentTypes";

const appointmentSelect = `
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
    location,
    avatar_url
  ),
  gps (
    id,
    full_name,
    practice_name
  )
`;

export async function createAppointment(
  input: AppointmentInput
): Promise<Appointment> {
  console.log("[createAppointment] input:", input);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("[createAppointment] auth user:", user);
  console.log("[createAppointment] auth userError:", userError);

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in to book an appointment.");

  const now = new Date().toISOString();
  const referralRequired = input.referralRequired ?? false;
  const gpId = input.gpId ?? null;

  const payload = {
    user_id: user.id,
    doctor_id: input.doctorId,
    gp_id: gpId,

    referral_required: referralRequired,
    referral_status: referralRequired
      ? gpId
        ? "provided"
        : "missing"
      : "not_required",

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
  };

  console.log("[createAppointment] payload:", payload);

  const { data, error } = await supabase
    .from("appointments")
    .insert(payload)
    .select(appointmentSelect)
    .single();

  console.log("[createAppointment] insert data:", data);
  console.log("[createAppointment] insert error:", error);

  if (error) throw new Error(error.message);

  return data as unknown as Appointment;
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(appointmentSelect)
    .neq("status", "cancelled")
    .order("starts_at", { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as Appointment[];
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .select(appointmentSelect)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as unknown as Appointment;
}

export type UpdateAppointmentInput = {
  id: string;
  startsAt?: string;
  endsAt?: string;
  reason?: string;
  location?: string | null;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
};

export async function updateAppointment(
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.startsAt !== undefined) patch.starts_at = input.startsAt;
  if (input.endsAt !== undefined) patch.ends_at = input.endsAt;
  if (input.reason !== undefined) patch.reason = input.reason;
  if (input.location !== undefined) patch.location = input.location;
  if (input.patientName !== undefined) patch.patient_name = input.patientName;
  if (input.patientEmail !== undefined) patch.patient_email = input.patientEmail;
  if (input.patientPhone !== undefined) patch.patient_phone = input.patientPhone;

  const { data, error } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", input.id)
    .select(appointmentSelect)
    .single();

  if (error) throw error;

  return data as unknown as Appointment;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(appointmentSelect)
    .single();

  if (error) throw error;

  return data as unknown as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) throw error;
}