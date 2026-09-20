import { updatePassword } from "@/src/api/auth/api";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function useResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function handleReset() {

    const { t } = useTranslation();


    if (!password || !confirm) {
      setError(t(`useResetPassword.fill`));
      return;
    }

    if (password !== confirm) {
      setError(t(`useResetPassword.noMatch`));
      return;
    }

    if (password.length < 6) {
      setError(t(`useResetPassword.charac`));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updatePassword(password);
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`useResetPassword.fail`));
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