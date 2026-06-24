import { supabase } from "@/supabase/supabase";

export async function getSpecialistTypes() {
  const { data, error } = await supabase
    .from("clinicians")
    .select("specialty")
    .eq("is_active", true)
    .order("specialty", { ascending: true });

  if (error) throw error;

  return Array.from(
    new Set(data.map((item) => item.specialty).filter(Boolean)),
  );
}

export async function getCliniciansBySpecialty(specialty: string) {
  const { data, error } = await supabase
    .from("clinicians")
    .select(
      `
      id,
      full_name,
      role,
      specialty,
      bio,
      clinic_name,
      location,
      avatar_url,
      rating,
      years_experience
    `,
    )
    .eq("is_active", true)
    .eq("specialty", specialty)
    .order("full_name", { ascending: true });

  if (error) throw error;

  return data;
}
