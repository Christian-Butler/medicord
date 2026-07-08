import { createAppointment } from "@/src/api/appointments/api";
import type {
  Appointment,
  AppointmentInput,
} from "@/src/types/appointmentTypes";
import { useCallback, useState } from "react";

export function useCreateAppointment(refetch?: () => Promise<Appointment[]>) {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const create = useCallback(
    async (input: AppointmentInput) => {
      try {
        setCreating(true);
        setCreateError(null);

        const row = await createAppointment(input);

        if (refetch) {
          await refetch();
        }

        return row;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create appointment";

        setCreateError(message);
        throw err;
      } finally {
        setCreating(false);
      }
    },
    [refetch]
  );

  return {
    create,
    creating,
    createError,
  };
}