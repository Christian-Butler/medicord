import { getMyMedicalRecords } from "@/src/api/medical-records/api";
import type { MedicalRecordsCategory } from "@/components/mr-search-lists";
import { useCallback, useEffect, useState } from "react";
import type { MedicalRecord } from "@/src/types/medicalRecordTypes";
export function useMedicalRecords(category?: MedicalRecordsCategory) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyMedicalRecords();
      const filtered = category ? data.filter((r) => r.category === category) : data;
      setRecords(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}