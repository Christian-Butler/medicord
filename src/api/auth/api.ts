import { supabase } from "@/supabase/supabase";

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string | null;
  dateOfBirth?: string | null;
};

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;

  return data;
}

export async function registerWithEmail(input: RegisterInput) {
  const email = input.email.trim();
  const fullName = input.fullName.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: fullName,
        phone: input.phone ?? null,
        date_of_birth: input.dateOfBirth ?? null,
      },
    },
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error("Account could not be created.");
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}