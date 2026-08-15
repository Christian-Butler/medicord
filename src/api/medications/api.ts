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
  const { data, error } = await supabase
    .from("medication")
    .select(medicationSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Medication[];
}

export async function getMedicationById(id: number): Promise<Medication> {
  const { data, error } = await supabase
    .from("medication")
    .select(medicationSelect)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Medication;
}

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