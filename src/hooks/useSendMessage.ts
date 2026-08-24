import { sendMessage } from "@/src/api/messages/api";
import { useCallback, useState } from "react";

export function useSendMessage(doctorId: string) {
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const send = useCallback(async (content: string) => {
    if (!content.trim()) return;
    try {
      setSending(true);
      setSendError(null);
      await sendMessage(doctorId, content);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    } finally {
      setSending(false);
    }
  }, [doctorId]);

  return { send, sending, sendError };
}