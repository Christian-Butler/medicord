// src/api/profile/avatar.ts
import { supabase } from "@/supabase/supabase";

export async function uploadAvatar(userId: string, uri: string): Promise<string> {
  const ext = uri.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, blob, {
      upsert: true,
      contentType: `image/${ext}`,
    });

  if (error) throw new Error(`Avatar upload failed: ${error.message}`);

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  // save url back to profile
  await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);

  return data.publicUrl;
}