import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import { supabase } from "@/supabase/supabase";

export type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  gp: {
    id: string;
    full_name: string;
    practice_name: string | null;
    practice_location: string | null;
  } | null;
};

const profileSelect = `
  id,
  full_name,
  email,
  phone,
  date_of_birth,
  avatar_url,
  gp:gps (
    id,
    full_name,
    practice_name,
    practice_location
  )
`;

export async function getMyProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(`Profile query failed: ${error.message}`);
  if (!data) throw new Error(`No profile found for user ${userId}`);

  return data as unknown as Profile;
}

export async function updatePhone(newPhone: string) {
  const userId = await getCurrentAppUserId();

  const { error } = await supabase
    .from("profiles")
    .update({ phone: newPhone })
    .eq("id", userId);

  if (error) throw error;
}

export async function uploadAvatar(userId: string, uri: string): Promise<string> {
  const ext = uri.split(".").pop()?.split("?")[0] ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const formData = new FormData();
  formData.append("file", {
    uri,
    name: `avatar.${ext}`,
    type: `image/${ext}`,
  } as any);

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, formData, {
      upsert: true,
      contentType: `image/${ext}`,
    });

  if (error) throw new Error(`Avatar upload failed: ${error.message}`);

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const versionedUrl = `${data.publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: versionedUrl })
    .eq("id", userId);

  if (updateError) throw updateError;

  return versionedUrl;
}