// src/api/profile/avatar.ts
import { supabase } from "@/supabase/supabase";

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

  await supabase
    .from("profiles")
    .update({ avatar_url: `${data.publicUrl}?t=${Date.now()}` })
    .eq("id", userId);

  return data.publicUrl;
}