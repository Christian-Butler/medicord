import { formatSlotLabel, toTimeValue } from "@/src/utils/dateTime";
import { supabase } from "@/supabase/supabase";

type SlotRow = {
  doctor_id: string;
  starts_at: string;
};

// Next free slot for each doctor, as a display label (doctor list).
export async function getNextAvailableSlots(
  doctorIds: string[]
): Promise<Record<string, string>> {
  if (doctorIds.length === 0) return {};

  const { data, error } = await supabase.rpc("get_available_slots", {
    p_doctor_ids: doctorIds,
    p_first_only: true,
  });

  if (error) throw error;

  const result: Record<string, string> = {};
  for (const row of (data ?? []) as SlotRow[]) {
    result[row.doctor_id] = formatSlotLabel(row.starts_at);
  }
  return result;
}

// Free times ("HH:MM") for one doctor on one date (booking picker).
export async function getAvailableTimes(
  doctorId: string,
  date: string
): Promise<string[]> {
  const { data, error } = await supabase.rpc("get_available_slots", {
    p_doctor_ids: [doctorId],
    p_from: date,
    p_days: 1,
  });

  if (error) throw error;

  return ((data ?? []) as SlotRow[]).map((row) => toTimeValue(row.starts_at));
}