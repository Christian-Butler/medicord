import { supabase } from "@/supabase/supabase";
import type { Medication, MedicationInput } from "@/src/types/medicationTypes";
import { getCurrentAppUserId } from "@/src/api/auth/currentUser";

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
  evening_frequency,
  frequency
`;

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
  frequency?: string | null;
};

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

export async function createMedication(input: MedicationInput): Promise<Medication> {
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
    frequency: input.frequency ?? null,
  };

  const { data, error } = await supabase
    .from("medication")
    .insert(payload)
    .select(medicationSelect)
    .single();

  if (error) throw error;

  return data as Medication;
}

export async function updateMedication(input: UpdateMedicationInput): Promise<Medication> {
  const userId = await getCurrentAppUserId();

  const patch: Record<string, unknown> = {};

  if (input.name !== undefined) patch.name = input.name;
  if (input.noSpecificTime !== undefined) patch.no_specific_time = input.noSpecificTime;
  if (input.noSpecificHour !== undefined) patch.no_specific_hour = input.noSpecificHour;
  if (input.instructions !== undefined) patch.instructions = input.instructions;
  if (input.hours !== undefined) patch.hours = input.hours;
  if (input.daysFrequency !== undefined) patch.days_frequency = input.daysFrequency;
  if (input.monthsDuration !== undefined) patch.months_duration = input.monthsDuration;
  if (input.weeksDuration !== undefined) patch.weeks_duration = input.weeksDuration;
  if (input.daysDuration !== undefined) patch.days_duration = input.daysDuration;
  if (input.morningFrequency !== undefined) patch.morning_frequency = input.morningFrequency;
  if (input.noonFrequency !== undefined) patch.noon_frequency = input.noonFrequency;
  if (input.eveningFrequency !== undefined) patch.evening_frequency = input.eveningFrequency;
  if (input.frequency !== undefined) patch.frequency = input.frequency;

  const { data, error } = await supabase
    .from("medication")
    .update(patch)
    .eq("id", input.id)
    .eq("user_id", userId)
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