import { createMedicalRecord, createMedicalRecords } from "@/src/api/medical-records/api";
import type { MedicalRecordInput } from "@/src/types/medicalRecordTypes";
import { useCallback, useState } from "react";

export function useCreateMedicalRecord() {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // shared loading/error handling for single and batch saves
  const run = useCallback(async <T,>(save: () => Promise<T>) => {
    try {
      setCreating(true);
      setCreateError(null);
      return await save();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create record";
      setCreateError(message);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  const create = useCallback(
    (input: MedicalRecordInput) => run(() => createMedicalRecord(input)),
    [run]
  );

  const createMany = useCallback(
    (inputs: MedicalRecordInput[]) => run(() => createMedicalRecords(inputs)),
    [run]
  );

  return { create, createMany, creating, createError };
}