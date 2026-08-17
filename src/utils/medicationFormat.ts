export function formatMedicationDuration(
  months?: number | null,
  weeks?: number | null,
  days?: number | null
) {
  const parts: string[] = [];

  if (months) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (weeks) parts.push(`${weeks} week${weeks === 1 ? "" : "s"}`);
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);

  return parts.length > 0 ? parts.join(" ") : "No duration set";
}

export function formatMedicationFrequency(daysFrequency?: string[] | null) {
  if (!daysFrequency || daysFrequency.length === 0) {
    return "No frequency set";
  }

  return daysFrequency.join(", ");
}

export function formatMedicationInstructions(instructions?: string[] | null) {
  if (!instructions || instructions.length === 0) {
    return "No instructions added";
  }

  return instructions.join("\n");
}

export function formatMedicationHours(hours?: number[] | null) {
  if (!hours || hours.length === 0) {
    return "No hours set";
  }

  return hours
    .sort((a, b) => a - b)
    .map((hour) => `${String(hour).padStart(2, "0")}:00`)
    .join(", ");
}

export function formatMedicationDoseFrequency(
  morning?: number | null,
  noon?: number | null,
  evening?: number | null
) {
  const parts: string[] = [];

  if (morning) parts.push(`${morning} morning`);
  if (noon) parts.push(`${noon} noon`);
  if (evening) parts.push(`${evening} evening`);

  return parts.length > 0 ? parts.join(", ") : "No dose frequency set";
}