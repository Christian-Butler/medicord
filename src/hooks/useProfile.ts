import { uploadAvatar } from "@/src/api/profile/api";
import { useAuth } from "@/src/context/AuthContext";
import { formatDob } from "@/src/utils/dateTime";
import * as ImagePicker from "expo-image-picker";

export function useProfile() {
  const { userId, profile, profileLoading, profileError, setProfile } = useAuth();

  async function handleEditAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const url = await uploadAvatar(userId, result.assets[0].uri);
        setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev));
      } catch (err) {
        console.error("[useProfile] avatar upload failed:", err);
      }
    }
  }

  return {
    fullName: profile?.full_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "Not set",
    dob: profile?.date_of_birth ? formatDob(profile.date_of_birth) : "Not set",
    location: profile?.gp?.practice_location ?? "Address unspecified",
    avatarUrl: profile?.avatar_url ?? null,
    loading: profileLoading,
    error: profileError,
    handleEditAvatar,
  };
}