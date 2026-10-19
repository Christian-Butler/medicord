import { getConversations, type Conversation } from "@/src/api/messages/api";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setConversations(await getConversations());
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`useConversations.error`));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
}