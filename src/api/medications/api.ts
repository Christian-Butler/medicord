import { supabase } from "@/supabase/supabase";
import type {
  Medication,
  MedicationInput,
} from "@/src/types/medicationTypes";
import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import type { Medication } from "@/src/types/medicationTypes";
import { supabase } from "@/supabase/supabase";

const medicationSelect = `
  id,
  created_at,
  name,
  no_specific_time,
  no_specific_hour,
  instructions,
  user_id,
  hours,
  days_frequency,
  months_duration,
  weeks_duration,
  days_duration,
  morning_frequency,
  noon_frequency,
  evening_frequency
`;

export async function getMyMedications(): Promise<Medication[]> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("medication")
    .select(medicationSelect)
    .eq("user_id", userId)
    .order("id", { ascending: true });

  if (error) throw error;

  return (data ?? []) as Medication[];
}

export async function getMedicationById(id: number): Promise<Medication> {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("medication")
    .select(medicationSelect)
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data as Medication;
}

export async function createMedication(
  input: MedicationInput
): Promise<Medication> {
  const userId = await getCurrentAppUserId();

  const payload = {
    user_id: userId,
    name: input.name,
    no_specific_time: input.noSpecificTime ?? false,
    no_specific_hour: input.noSpecificHour ?? false,
    instructions: input.instructions ?? [],
    hours: input.hours ?? [],
    days_frequency: input.daysFrequency ?? [],
    months_duration: input.monthsDuration ?? null,
    weeks_duration: input.weeksDuration ?? null,
    days_duration: input.daysDuration ?? null,
    morning_frequency: input.morningFrequency ?? null,
    noon_frequency: input.noonFrequency ?? null,
    evening_frequency: input.eveningFrequency ?? null,
  };

  const { data, error } = await supabase
    .from("medication")
    .insert(payload)
    .select(medicationSelect)
    .single();

  if (error) throw error;

  return data as Medication;
}

export type UpdateMedicationInput = {
  id: number;
  name?: string;
  noSpecificTime?: boolean;
  noSpecificHour?: boolean;
  instructions?: string[];
  hours?: number[];
  daysFrequency?: string[];
  monthsDuration?: number | null;
  weeksDuration?: number | null;
  daysDuration?: number | null;
  morningFrequency?: number | null;
  noonFrequency?: number | null;
  eveningFrequency?: number | null;
};

export async function updateMedication(
  input: UpdateMedicationInput
): Promise<Medication> {
  const userId = await getCurrentAppUserId();

  const patch: Record<string, unknown> = {};

  if (input.name !== undefined) patch.name = input.name;
  if (input.noSpecificTime !== undefined) {
    patch.no_specific_time = input.noSpecificTime;
  }
  if (input.noSpecificHour !== undefined) {
    patch.no_specific_hour = input.noSpecificHour;
  }
  if (input.instructions !== undefined) patch.instructions = input.instructions;
  if (input.hours !== undefined) patch.hours = input.hours;
  if (input.daysFrequency !== undefined) {
    patch.days_frequency = input.daysFrequency;
  }
  if (input.monthsDuration !== undefined) {
    patch.months_duration = input.monthsDuration;
  }
  if (input.weeksDuration !== undefined) {
    patch.weeks_duration = input.weeksDuration;
  }
  if (input.daysDuration !== undefined) {
    patch.days_duration = input.daysDuration;
  }
  if (input.morningFrequency !== undefined) {
    patch.morning_frequency = input.morningFrequency;
  }
  if (input.noonFrequency !== undefined) {
    patch.noon_frequency = input.noonFrequency;
  }
  if (input.eveningFrequency !== undefined) {
    patch.evening_frequency = input.eveningFrequency;
  }

  const { data, error } = await supabase
    .from("medication")
    .update(patch)
    .eq("id", input.id)
    .eq("user_id", userId)
export type CreateMedicationInput = {
  name: string;
  no_specific_time: boolean;
  no_specific_hour: boolean;
  instructions: string[];
  hours: number[];
  days_frequency: string[];
  months_duration: number;
  weeks_duration: number;
  days_duration: number;
  morning_frequency: number;
  noon_frequency: number;
  evening_frequency: number;
  frequency?: string | null;
};

export async function createMedication(
  input: CreateMedicationInput
): Promise<Medication> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("You must be logged in to create a routine.");

  const { data, error } = await supabase
    .from("medication")
    .insert([{ ...input, user_id: user.id }])
    .select(medicationSelect)
    .single();

  if (error) throw error;

  return data as Medication;
}

export async function deleteMedication(id: number): Promise<void> {
  const userId = await getCurrentAppUserId();

  const { error } = await supabase
    .from("medication")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}