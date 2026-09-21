import { updateEmail } from "@/src/api/auth/api"
import { useState } from "react"

export function useUpdateEmail() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false)

    async function handleUpdateEmail() {
        if (!email.trim()) {
            setError("Please enter an email address. ")
            return;
        }
        try {
            setLoading(true);
            setError(null)
            await updateEmail(email.trim())
            setShowConfirmation(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update email address")
        }
    }
    return { email, setEmail, loading, error, showConfirmation, setShowConfirmation, handleUpdateEmail };
}