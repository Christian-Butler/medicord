import { supabase } from "@/supabase/supabase";

export async function getMyUser(userId: string | null | undefined) {
  if (!userId) {
    throw new Error("getMyUser called without a userId");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Auth user check failed: ${authError.message}`);
  }

  if (!user) {
    throw new Error("No authenticated Supabase user found");
  }

  if (user.id !== userId) {
    throw new Error(
      `Authenticated user mismatch. Expected ${userId}, got ${user.id}`
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Profile query failed: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      `Profile row exists in DB maybe, but client could not read it for user ${userId}. Check RLS policy.`
    );
  }

  return data;
}