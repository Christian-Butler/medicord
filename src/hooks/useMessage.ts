import {
  getMessages,
  markAsRead,
  type Message,
} from "@/src/api/messages/api";
import { setDemoSession } from "@/src/api/auth/demoSession";
import { supabase } from "@/supabase/supabase";
import { useCallback, useEffect, useState } from "react";

export function useMessages(doctorId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(doctorId);
      setMessages(data);
      await markAsRead(doctorId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel(`messages:${doctorId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `doctor_id=eq.${doctorId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.find((m) => m.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new as Message];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}