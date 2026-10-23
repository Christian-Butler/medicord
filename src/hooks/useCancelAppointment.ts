import { deleteAppointment } from "@/src/api/appointments/api";
import { removeAppointmentFromCalendar } from "@/src/libs/appointmentCalendar";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useCallback, useState } from "react";

export function useCancelAppointment(refetch?: () => Promise<Appointment[]>) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const cancelById = useCallback(
    async (id: string) => {
      try {
        setCancelling(true);
        setCancelError(null);

        await deleteAppointment(id);

        // remove its calendar event and reminders from this phone (if any)
        await removeAppointmentFromCalendar(id).catch((err) =>
          console.warn("[useCancelAppointment] calendar cleanup failed:", err)
        );

        if (refetch) {
          await refetch();
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to cancel appointment";

        setCancelError(message);
        throw err;
      } finally {
        setCancelling(false);
      }
    },
    [refetch]
  );

  return {
    cancelById,
    cancelling,
    cancelError,
  };
}