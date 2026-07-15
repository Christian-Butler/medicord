import { registerWithEmail } from "@/src/api/auth/api";
import { uploadAvatar } from "@/src/api/auth/avatar";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";

export function useRegister() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePickAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please enter your name, email, and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await registerWithEmail({
        fullName,
        email,
        password,
        phone: phone.trim() || null,
        dateOfBirth: dateOfBirth.trim() || null,
      });

      if (avatarUri && data.user?.id) {
        await uploadAvatar(data.user.id, avatarUri);
      }

      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  }

  return {
    fullName, setFullName,
    dateOfBirth, setDateOfBirth,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    avatarUri,
    loading,
    error,
    handlePickAvatar,
    handleRegister,
  };
}