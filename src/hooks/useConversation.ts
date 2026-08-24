import { getConversations, type Conversation } from "@/src/api/messages/api";
import { useCallback, useEffect, useState } from "react";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations();
      const seen = new Set();
      const deduped = data.filter((msg) => {
        if (seen.has(msg.doctor_id)) return false;
        seen.add(msg.doctor_id);
        return true;
      });
      setConversations(deduped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
}