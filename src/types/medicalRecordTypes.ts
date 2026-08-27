import { MedicalRecordsCategory } from "@/components/mr-search-lists";

export type MedicalRecord = {
  id: string;
  created_at: string;
  user_id: string;
  category: MedicalRecordsCategory;
  item: string;
  vaccine_date: string | null;
  operation_date: string | null;
  diagnosis: string | null;
  condition_state: string | null;
  updated_at: string;
};

export type MedicalRecordInput = {
  category: MedicalRecordsCategory;
  item: string;
  vaccineDate?: string | null;
  operationDate?: string | null;
  diagnosis?: string | null;
  conditionState?: string | null;
};