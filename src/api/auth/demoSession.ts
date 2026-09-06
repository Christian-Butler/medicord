import { supabase } from "@/supabase/supabase";
import type { User } from "@supabase/supabase-js";

const DEMO_EMAIL = process.env.EXPO_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.EXPO_PUBLIC_DEMO_PASSWORD;

let demoSessionPromise: Promise<User | null> | null = null;

export async function setDemoSession(): Promise<User | null> {
  if (!DEMO_EMAIL || !DEMO_PASSWORD) {
    throw new Error("Missing EXPO_PUBLIC_DEMO_EMAIL or EXPO_PUBLIC_DEMO_PASSWORD");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(`Failed to read Supabase session: ${sessionError.message}`);
  }

  if (session?.user) {
    return session.user;
  }

  if (demoSessionPromise) {
    return demoSessionPromise;
  }

  demoSessionPromise = (async () => {
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
  })();

  try {
    return await demoSessionPromise;
  } finally {
    demoSessionPromise = null;
  }
}