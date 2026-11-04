import { setMyGp } from "@/src/api/profile/api"
import { useAuth } from "@/src/context/AuthContext";
import { useCallback, useState } from "react";

export function useSetGp() {
    const { setProfile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setGp = useCallback(
        async (gpId: string) => {
            try {
                setSaving(true);
                setError(null);

                const profile = await setMyGp(gpId);
                setProfile(profile);
                
                return profile;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to save your Gp");
                throw err;
            } finally {
                setSaving(false);
            }

        },
        [setProfile]
    );

    return { setGp, saving, error };
}