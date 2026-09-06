import { sendPasswordReset } from "@/src/api/auth/api";
import { useState } from "react";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return {
    email, setEmail,
    loading,
    error,
    sent,
    handleSend,
  };
}