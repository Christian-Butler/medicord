import { supabase } from "@/supabase/supabase";

export const DEMO_USER_ID = "296cd3f0-6100-4ee9-b7e0-88fdfc2dfae5";

export async function getCurrentAppUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.warn("[getCurrentAppUserId] Falling back to demo user:", error);
    return DEMO_USER_ID;
  }

  return user?.id ?? DEMO_USER_ID;
}