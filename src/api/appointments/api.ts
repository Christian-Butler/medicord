import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import type {
  Appointment,
  AppointmentInput,
} from "@/src/types/appointmentTypes";
import { supabase } from "@/supabase/supabase";

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

// turn database errors into messages a patient can act on
function toAppointmentError(error: { code?: string; message: string }) {
  if (error.code === "23505") {
    // appointments_doctor_slot_unique: someone booked this slot first
    return new Error("That time has just been booked. Please choose another.");
  }
  return new Error(error.message);
}

export async function createAppointment(
  input: AppointmentInput
): Promise<Appointment> {
  const userId = await getCurrentAppUserId();

  const now = new Date().toISOString();
  const referralRequired = input.referralRequired ?? false;
  const gpId = input.gpId ?? null;

  const payload = {
    user_id: userId,
    doctor_id: input.doctorId,
    gp_id: gpId,

    referral_required: referralRequired,
    referral_status: referralRequired
      ? gpId
        ? "provided"
        : "missing"
      : "not_required",

    title: input.reason ?? "Consultation",
    appointment_type: "consultation",
    location: input.location ?? null,

    starts_at: input.startsAt,
    ends_at: input.endsAt,

    status: "pending",
    reason: input.reason ?? null,
    notes: null,

    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("appointments")
    .insert(payload)
    .select(appointmentSelect)
    .single();

  if (error) throw toAppointmentError(error);

  return data as unknown as Appointment;
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("appointments")
    .select(appointmentSelect)
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("starts_at", { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as Appointment[];
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("appointments")
    .select(appointmentSelect)
    .eq("id", id)
    .eq("user_id", userId)
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
};

export async function updateAppointment(
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const userId = await getCurrentAppUserId();

  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.startsAt !== undefined) patch.starts_at = input.startsAt;
  if (input.endsAt !== undefined) patch.ends_at = input.endsAt;
  if (input.reason !== undefined) patch.reason = input.reason;
  if (input.location !== undefined) patch.location = input.location;

  const { data, error } = await supabase
    .from("appointments")
    .update(patch)
    .eq("id", input.id)
    .eq("user_id", userId)
    .select(appointmentSelect)
    .single();

  if (error) throw toAppointmentError(error);

  return data as unknown as Appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const userId = await getCurrentAppUserId();

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}