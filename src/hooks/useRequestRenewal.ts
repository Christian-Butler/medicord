import { requestRenewal } from "@/src/api/prescriptions/api";
import type { Prescription, RenewalInput } from "@/src/types/prescriptionTypes";
import { useCallback, useState } from "react";

export function useRequestRenewal(refetch?: () => Promise<Prescription[]>) {
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const request = useCallback(
    async (input: RenewalInput) => {
      try {
        setRequesting(true);
        setRequestError(null);

        const renewal = await requestRenewal(input);

        if (refetch) await refetch();

        return renewal;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to request renewal";
        setRequestError(message);
        throw err;
      } finally {
        setRequesting(false);
      }
    },
    [refetch],
  );

  return { request, requesting, requestError };
}
