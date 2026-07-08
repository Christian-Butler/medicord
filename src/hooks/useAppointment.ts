import { getAppointmentById } from "@/src/api/appointments/api";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useCallback, useEffect, useState } from "react";

export function useAppointment(appointmentId?: string) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!appointmentId) {
      setAppointment(null);
      setError("Missing appointment.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const row = await getAppointmentById(appointmentId);

      setAppointment(row);

      return row;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load appointment";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    appointment,
    loading,
    error,
    refetch,
  };
}