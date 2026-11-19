import medicineList from "@/src/data/medicines.json";
import type { Medicine } from "@/src/types/medicineTypes";
import { useMemo } from "react";

const medicines = medicineList as Medicine[];
const MAX_SUGGESTIONS = 8;

export function useMedicineSuggestions(query: string) {
  const suggestions = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.length < 2) return [];

    // Names starting with what was typed come first, then names containing it,
    // then medicines whose active substance matches (e.g. "amoxicillin" finds branded products).
    const startsWith: Medicine[] = [];
    const contains: Medicine[] = [];
    const bySubstance: Medicine[] = [];

    for (const medicine of medicines) {
      const name = medicine.name.toLowerCase();

      if (name.startsWith(trimmedQuery)) startsWith.push(medicine);
      else if (name.includes(trimmedQuery)) contains.push(medicine);
      else if (medicine.substance?.toLowerCase().includes(trimmedQuery))
        bySubstance.push(medicine);

      if (startsWith.length >= MAX_SUGGESTIONS) break;
    }

    return [...startsWith, ...contains, ...bySubstance].slice(
      0,
      MAX_SUGGESTIONS,
    );
  }, [query]);

  return { suggestions };
}
