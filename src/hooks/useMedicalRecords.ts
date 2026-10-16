import type { MedicalRecordsCategory } from "@/components/mr-search-lists";
import { getMyMedicalRecords } from "@/src/api/medical-records/api";
import type { MedicalRecord } from "@/src/types/medicalRecordTypes";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export function useMedicalRecords(category?: MedicalRecordsCategory) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false)

  const { t } = useTranslation();

  const fetchRecords = useCallback(async () => {
    try {
      if (!hasLoaded.current) setLoading(true);
      setError(null);
      const data = await getMyMedicalRecords(category);
      setRecords(data);
      hasLoaded.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`useMedicalRecords.fail`));
    } finally {
      setLoading(false);
    }
  }, [category, t]);

  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [fetchRecords])
  );

  return { records, loading, error, refetch: fetchRecords };
}