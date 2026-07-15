import { updatePassword } from "@/src/api/auth/api";
import { router } from "expo-router";
import { useState } from "react";

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    if (!password || !confirm) {
      setError("Please fill in both fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updatePassword(password);
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return {
    password, setPassword,
    confirm, setConfirm,
    loading,
    error,
    handleReset,
  };
}