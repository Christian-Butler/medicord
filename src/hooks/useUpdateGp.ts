import { updateGp } from "@/src/api/profile/api";
import { useAuth } from "@/src/context/AuthContext";
import { useState } from "react";

export function useUpdateGp() {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateGp(gpId: string) {
    try {
      setLoading(true);
      setError(null);
      await updateGp(gpId);
      await refreshProfile();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update GP.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, handleUpdateGp };
}
