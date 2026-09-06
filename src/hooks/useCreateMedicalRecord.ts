import { createMedicalRecord } from "@/src/api/medical-records/api";
import { useCallback, useState } from "react";
import type { MedicalRecordInput } from "@/src/types/medicalRecordTypes";

export function useCreateMedicalRecord() {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const create = useCallback(async (input: MedicalRecordInput) => {
    try {
      setCreating(true);
      setCreateError(null);
      const record = await createMedicalRecord(input);
      return record;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create record";
      setCreateError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  return { create, creating, createError };
}