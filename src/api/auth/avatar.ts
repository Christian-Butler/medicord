// src/api/profile/avatar.ts
import { supabase } from "@/supabase/supabase";

export async function uploadAvatar(userId: string, uri: string): Promise<string> {
  console.log('[uploadAvatar] starting upload for user:', userId);
  console.log('[uploadAvatar] uri:', uri);
  
  const ext = uri.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  console.log('[uploadAvatar] path:', path);

  const response = await fetch(uri);
  const blob = await response.blob();

  console.log('[uploadAvatar] blob size:', blob.size);

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, blob, {
      upsert: true,
      contentType: `image/${ext}`,
    });

  if (error) {
    console.error('[uploadAvatar] upload error:', error);
    throw new Error(`Avatar upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  console.log('[uploadAvatar] public url:', data.publicUrl);

  await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);

  return data.publicUrl;
}