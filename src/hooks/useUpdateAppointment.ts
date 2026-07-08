import {
  updateAppointment,
  type UpdateAppointmentInput,
} from "@/src/api/appointments/api";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useCallback, useState } from "react";

export function useUpdateAppointment(refetch?: () => Promise<Appointment[]>) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const update = useCallback(
    async (input: UpdateAppointmentInput) => {
      try {
        setUpdating(true);
        setUpdateError(null);

        const row = await updateAppointment(input);

        if (refetch) {
          await refetch();
        }

        return row;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update appointment";

        setUpdateError(message);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [refetch]
  );

  return {
    update,
    updating,
    updateError,
  };
}