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