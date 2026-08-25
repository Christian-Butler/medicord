import { supabase } from "@/supabase/supabase";
import { setDemoSession } from "@/src/api/auth/demoSession";

export async function getFavouriteDoctors() {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("favourite_doctor_ids")
    .eq("id", user.id)
    .single();

  if (profileError) throw new Error(profileError.message);
  if (!profile?.favourite_doctor_ids?.length) return [];

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .in("id", profile.favourite_doctor_ids);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function toggleFavouriteDoctor(doctorId: string): Promise<boolean> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("favourite_doctor_ids")
    .eq("id", user.id)
    .single();

  if (profileError) throw new Error(profileError.message);

  const current: string[] = profile?.favourite_doctor_ids ?? [];
  const isFavourite = current.includes(doctorId);

  const updated = isFavourite
    ? current.filter((id) => id !== doctorId)
    : [...current, doctorId];

  const { error } = await supabase
    .from("profiles")
    .update({ favourite_doctor_ids: updated })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  return !isFavourite;
}

export async function isFavouriteDoctor(doctorId: string): Promise<boolean> {
  const user = await setDemoSession();
  if (!user) throw new Error("No user session");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("favourite_doctor_ids")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return (profile?.favourite_doctor_ids ?? []).includes(doctorId);
}