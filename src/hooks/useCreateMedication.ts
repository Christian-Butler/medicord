import {
    createMedication,
    type CreateMedicationInput,
} from "@/src/api/medications/api";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";

export function useCreateMedication() {
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const create = useCallback(
        async (input: CreateMedicationInput): Promise<Medication> => {
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