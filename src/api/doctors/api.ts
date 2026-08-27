import { supabase } from "@/supabase/supabase";

export async function getDoctorsBySpecialty(specialty: string) {
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      id,
      full_name,
      role,
      specialty,
      bio,
      clinic_name,
      location,
      avatar_url,
      rating,
      years_experience,
      previous_experience,
      qualified_year,
      consultation_fee,
      requires_gp_referral
    `)
    .eq("is_active", true)
    .eq("specialty", specialty)
    .order("full_name", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getDoctorById(id: string) {
  const { data, error } = await supabase
    .from("doctors")
    .select(`
      id,
      full_name,
      specialty,
      bio,
      clinic_name,
      location,
      avatar_url,
      rating,
      years_experience,
      previous_experience,
      qualified_year,
      consultation_fee,
      requires_gp_referral
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}