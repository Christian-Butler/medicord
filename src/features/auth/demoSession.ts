import { supabase } from "@/supabase/supabase";

const DEMO_EMAIL = process.env.EXPO_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.EXPO_PUBLIC_DEMO_PASSWORD;

export async function setDemoSession() {
  if (!DEMO_EMAIL || !DEMO_PASSWORD) {
    throw new Error("Missing EXPO_PUBLIC_DEMO_EMAIL or EXPO_PUBLIC_DEMO_PASSWORD");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (error) {
    throw new Error(`Demo sign-in failed: ${error.message}`);
  }

  if (!data.session || !data.user) {
    throw new Error("Demo sign-in succeeded but no session/user was returned");
  }

  return data.user;
}