export function formatMedicationDuration(
  startDate: Date | string,
  endDate: Date | string
) {
  return `${toLocalDate(startDate).toLocaleDateString()} - ${toLocalDate(endDate).toLocaleDateString()}`;
}

function toLocalDate(value: Date | string) {
  if (value instanceof Date) return value;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);
}

export function getMedicationDaysRemaining(
  endDate: Date | string,
  today = new Date()
) {
  const end = toLocalDate(endDate);
  const current = toLocalDate(today);
  const endDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const currentDay = Date.UTC(current.getFullYear(), current.getMonth(), current.getDate());

  return Math.round((endDay - currentDay) / (24 * 60 * 60 * 1000));
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