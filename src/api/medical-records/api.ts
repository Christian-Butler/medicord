import type { MedicalRecordsCategory } from "@/components/mr-search-lists";
import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import type {
  MedicalRecord,
  MedicalRecordInput,
} from "@/src/types/medicalRecordTypes";
import { supabase } from "@/supabase/supabase";

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
  treatment_date,
  treatment_frequency,
  condition_state,
  updated_at
`;

// Save one or more records in a single request.
export async function createMedicalRecords(inputs: MedicalRecordInput[]): Promise<MedicalRecord[]> {
  if (inputs.length === 0) return [];

  const userId = await getCurrentAppUserId();
  const now = new Date().toISOString();

  const rows = inputs.map((input) => ({
    user_id: userId,
    category: input.category,
    item: input.item,
    vaccine_date: input.vaccineDate ?? null,
    operation_date: input.operationDate ?? null,
    family_diagnosis: input.familyDiagnosis ?? null,
    diagnosis: input.diagnosis ?? null,
    condition_state: input.conditionState ?? null,
    family_member: input.familyMember ?? null,
    treatment_date: input.treatmentDate ?? null,
    treatment_frequency: input.treatmentFrequency ?? null,
    created_at: now,
    updated_at: now,
  }));

  const { data, error } = await supabase
    .from("medical_records")
    .insert(rows)
    .select(medicalRecordsSelect);

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as MedicalRecord[];
}

export async function createMedicalRecord(input: MedicalRecordInput): Promise<MedicalRecord> {
  const [record] = await createMedicalRecords([input]);
  return record;
}

// One category, or several at once (e.g. family + personal history in one request).
export async function getMyMedicalRecords(
  categories?: MedicalRecordsCategory | MedicalRecordsCategory[]
): Promise<MedicalRecord[]> {
  const userId = await getCurrentAppUserId();

  let query = supabase
    .from("medical_records")
    .select(medicalRecordsSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (categories) {
    query = query.in("category", Array.isArray(categories) ? categories : [categories]);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as unknown as MedicalRecord[];
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