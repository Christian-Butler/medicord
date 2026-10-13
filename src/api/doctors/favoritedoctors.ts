import { supabase } from "@/supabase/supabase";
import { getCurrentAppUserId } from "@/src/api/auth/currentUser";

export async function getFavouriteDoctors() {
  const userId = await getCurrentAppUserId();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("favourite_doctor_ids")
    .eq("id", userId)
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
  const userId = await getCurrentAppUserId();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("favourite_doctor_ids")
    .eq("id", userId)
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
    .eq("id", userId);

  if (error) throw new Error(error.message);
  return !isFavourite;
}

export async function isFavouriteDoctor(doctorId: string): Promise<boolean> {
  const userId = await getCurrentAppUserId();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("favourite_doctor_ids")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return (profile?.favourite_doctor_ids ?? []).includes(doctorId);
}