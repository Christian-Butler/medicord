import { supabase } from "@/supabase/supabase";

export async function setDemoSession() {
  const accessToken = process.env.EXPO_PUBLIC_DEMO_ACCESS_TOKEN;
  const refreshToken = process.env.EXPO_PUBLIC_DEMO_REFRESH_TOKEN;

  if (!accessToken || !refreshToken) {
    throw new Error("Missing demo session tokens");
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) throw error;

  return data.session?.user ?? null;
}
