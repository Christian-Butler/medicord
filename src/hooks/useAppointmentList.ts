import { getMyAppointments } from "@/src/api/appointments/api";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useCallback, useEffect, useMemo, useState } from "react";

function isPastAppointment(appointment: Appointment) {
  return new Date(appointment.starts_at).getTime() < Date.now();
}

export function useAppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rows = await getMyAppointments();

      setAppointments(rows);

      return rows;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load appointments";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const upcomingAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) => !isPastAppointment(appointment)
    );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments.filter((appointment) => isPastAppointment(appointment));
  }, [appointments]);

  return {
    appointments,
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    refetch,
  };
}