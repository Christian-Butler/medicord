import { updatePhone } from "@/src/api/auth/api";
import { router } from "expo-router"
import { useState } from "react" 

export function useUpdatePhone() {
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);


   async function handleUpdatePhone() {
    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await updatePhone(phone.trim());
      setShowConfirmation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update phone.");
    } finally {
      setLoading(false);
    }
   }
    return { phone, setPhone, loading, error, showConfirmation, setShowConfirmation, handleUpdatePhone };
}