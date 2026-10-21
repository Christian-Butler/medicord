import {
    createMedication,
} from "@/src/api/medications/api";
import type { Medication, MedicationInput } from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";

export function useCreateMedication() {
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const create = useCallback(
        async (input: MedicationInput): Promise<Medication> => {
            setCreating(true);
            setCreateError(null);
            try {
                return await createMedication(input);
            } catch (err: any) {
                const message = err?.message ?? "Failed to create routine.";
                setCreateError(message);
                throw err;
            } finally {
                setCreating(false);
            }
        },
        []
    );

    return { create, creating, createError };
}