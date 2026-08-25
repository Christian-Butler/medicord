import { supabase } from "@/supabase/supabase";
import type {
  MedicalRecord,
  MedicalRecordInput,
} from "@/src/types/medicalRecordTypes";
import { setDemoSession } from "../auth/demoSession";

const medicalRecordsSelect = `
  id,
  created_at,
  user_id,
  category,
  item,
  vaccine_date,
  operation_date,
  diagnosis,
  condition_state,
  updated_at
`;

export async function createMedicalRecord(input: MedicalRecordInput): Promise<MedicalRecord> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const now = new Date().toISOString();

  const payload = {
    user_id: user.id,
    category: input.category,
    item: input.item,
    vaccine_date: input.vaccineDate ?? null,
    operation_date: input.operationDate ?? null,
    diagnosis: input.diagnosis ?? null,
    condition_state: input.conditionState ?? null,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("medical_records")
    .insert(payload)
    .select(medicalRecordsSelect)
    .single();

  if (error) throw new Error(error.message);

  return data as unknown as MedicalRecord;
}

export async function getMyMedicalRecords(): Promise<MedicalRecord[]> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data, error } = await supabase
    .from("medical_records")
    .select(medicalRecordsSelect)
    .eq("user_id", user.id);

  if (error) throw error;

  return data as unknown as MedicalRecord[];
}

export async function deleteMedicalRecord(id: string): Promise<void> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { error } = await supabase
    .from("medical_records")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}