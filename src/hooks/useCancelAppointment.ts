import { deleteAppointment } from "@/src/api/appointments/api";
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