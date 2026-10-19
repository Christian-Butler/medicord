import type { MedicalRecordsCategory } from "@/components/mr-search-lists";
import { getMyMedicalRecords } from "@/src/api/medical-records/api";
import type { MedicalRecord } from "@/src/types/medicalRecordTypes";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function useMedicalRecords(
  categories?: MedicalRecordsCategory | MedicalRecordsCategory[]
) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  const { t } = useTranslation();

  // a stable key, so a new array with the same categories doesn't refetch
  const key = Array.isArray(categories) ? categories.join(",") : categories ?? "";

  const fetchRecords = useCallback(async () => {
    try {
      if (!hasLoaded.current) setLoading(true);
      setError(null);
      const list = key ? (key.split(",") as MedicalRecordsCategory[]) : undefined;
      const data = await getMyMedicalRecords(list);
      setRecords(data);
      hasLoaded.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`useMedicalRecords.fail`));
    } finally {
      setLoading(false);
    }
  }, [key, t]);

  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [fetchRecords])
  );

  return { records, loading, error, refetch: fetchRecords };
}