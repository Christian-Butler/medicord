import { supabase } from "@/supabase/supabase";

export async function getMyUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, date_of_birth, gp_practice_name, gp_practice_location, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(`Profile query failed: ${error.message}`);
  if (!data) throw new Error(`No profile found for user ${userId}`);

  return data;
}