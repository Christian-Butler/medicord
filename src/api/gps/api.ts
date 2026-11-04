import type { Gp } from "@/src/types/gpTypes"
import { supabase } from "@/supabase/supabase"

const gpSelect = `
    id,
    full_name,
    practice_name,
    practice_location,
    phone,
    email


`;

export async function getGps(): Promise<Gp[]> {
    const { data, error } = await supabase
        .from("gps")
        .select(gpSelect)
        .eq("is_active", true)
        .order("full_name", { ascending: true })
    
    if (error) throw error;

    return (data ?? []) as Gp[];
}