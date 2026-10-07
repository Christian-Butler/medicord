import type {
  MedicalRecord,
  MedicalRecordInput,
} from "@/src/types/medicalRecordTypes";
import { supabase } from "@/supabase/supabase";
import { getCurrentAppUserId } from "@/src/api/auth/currentUser";

const medicalRecordsSelect = `
  id,
  created_at,
  user_id,
  category,
  item,
  vaccine_date,
  operation_date,
  diagnosis,
  family_diagnosis,
  family_member,
  condition_state,
  updated_at
`;

export async function createMedicalRecord(input: MedicalRecordInput): Promise<MedicalRecord> {
  const userId = await getCurrentAppUserId();

  const now = new Date().toISOString();

  const payload = {
    user_id: userId,
    category: input.category,
    item: input.item,
    vaccine_date: input.vaccineDate ?? null,
    operation_date: input.operationDate ?? null,
    family_diagnosis: input.familyDiagnosis ?? null,
    diagnosis: input.diagnosis ?? null,
    condition_state: input.conditionState ?? null,
    family_member: input.familyMember ?? null,
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

export async function getMyMedicalRecords(category?: string): Promise<MedicalRecord[]> {
  const userId = await getCurrentAppUserId();

  let query = supabase
    .from("medical_records")
    .select(medicalRecordsSelect)
    .eq("user_id", userId);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;

  if (error) throw error;

  return data as unknown as MedicalRecord[];
}

export async function deleteMedicalRecord(id: string): Promise<void> {
  const userId = await getCurrentAppUserId();

  const { error } = await supabase
    .from("medical_records")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}