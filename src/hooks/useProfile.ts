import { getMyUser } from "@/src/api/auth/getUser";
import { uploadAvatar } from "@/src/api/auth/avatar";
import { useAuth } from "@/src/context/AuthContext";
import { formatDob } from "@/src/utils/dateTime";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

export function useProfile() {
  const { userId } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [dob, setDob] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let mounted = true;
  async function load() {
    try {
      const data = await getMyUser(userId);
      if (!mounted) return;
      setFullName(data.full_name);
      setEmail(data.email);
      setPhone(data.phone);
      setDob(formatDob(data.date_of_birth));
      setLocation(data.gp_practice_location);
      setAvatarUrl(data.avatar_url ?? null);
    } catch (err) {
      if (!mounted) return;
      console.warn("[useProfile] failed:", err);
    } finally {
      if (mounted) setLoading(false);
    }
  }
  if (userId) load();
  return () => { mounted = false; };
}, [userId]);

  async function handleEditAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const url = await uploadAvatar(userId, result.assets[0].uri);
        setAvatarUrl(url);
      } catch (err) {
        console.error("[useProfile] avatar upload failed:", err);
      }
    }
  }

  return {
    fullName: fullName ?? "Philip Connally",
    email: email ?? "John@Doe.com",
    phone: phone ?? "XXX XXX XXX",
    dob: dob ?? "19/04/53",
    location: location ?? "Address unspecified",
    avatarUrl,
    loading,
    error,
    handleEditAvatar,
  };
}