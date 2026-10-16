import { getCurrentAppUserId } from "@/src/api/auth/currentUser";
import { supabase } from "@/supabase/supabase";

export async function getFavouriteDoctors() {
  const userId = await getCurrentAppUserId();

  const { data, error } = await supabase
    .from("favourite_doctors")
    .select("doctor:doctors (*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as { doctor: any }[]).map((row) => row.doctor);
}

export async function isFavouriteDoctor(doctorId: string): Promise<boolean> {
  const userId = await getCurrentAppUserId();

  const { count, error } = await supabase
    .from("favourite_doctors")
    .select("doctor_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("doctor_id", doctorId);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function toggleFavouriteDoctor(doctorId: string): Promise<boolean> {
  const userId = await getCurrentAppUserId();

  // try to remove it; if a row was removed, it was a favourite
  const { data: removed, error: deleteError } = await supabase
    .from("favourite_doctors")
    .delete()
    .eq("user_id", userId)
    .eq("doctor_id", doctorId)
    .select("doctor_id");

  if (deleteError) throw new Error(deleteError.message);
  if (removed && removed.length > 0) return false;

  // nothing removed, so add it
  const { error: insertError } = await supabase
    .from("favourite_doctors")
    .insert({ user_id: userId, doctor_id: doctorId });

  if (insertError) throw new Error(insertError.message);
  return true;
}