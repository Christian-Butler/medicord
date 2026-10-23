import * as Calendar from "expo-calendar";
import { createCalendarEvent, deleteCalendarEvent, type CalendarEventInput } from "@/src/libs/calender";
import { getCalendarLink, removeCalendarLink, saveCalendarLink } from "@/src/libs/calenderLinks";
import type { Medication } from "@/src/types/medicationTypes";

// Same labels the form uses, mapped to the calendar's weekday numbers (Sunday = 1).
export const WEEKDAYS: Record<string, Calendar.DayOfTheWeek> = {
  Mon: Calendar.DayOfTheWeek.Monday,
  Tue: Calendar.DayOfTheWeek.Tuesday,
  Wed: Calendar.DayOfTheWeek.Wednesday,
  Thu: Calendar.DayOfTheWeek.Thursday,
  Fri: Calendar.DayOfTheWeek.Friday,
  Sat: Calendar.DayOfTheWeek.Saturday,
  Sun: Calendar.DayOfTheWeek.Sunday,
};

// What each time-of-day chip means (start hour, end hour). Shared by the calendar, alarms and home countdown.
const TIME_WINDOWS: Record<string, [number, number]> = {
  Morning: [8, 11],
  Noon: [12, 14],
  Evening: [19, 21],
};

// "No time window needed" defaults to the same hour as the home screen countdown.
export const NO_TIME_HOUR = 8;

export type Slot = { label: string | null; startHour: number; endHour: number } | "allDay";

// Supabase gives dates back as strings; read "2026-10-22" as local midnight, not UTC.
export function toLocalDay(value: Date | string): Date {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// The form stores weekdays and time windows in the same list, so split them back out.
export function readRoutine(medication: Medication) {
  const chosen = medication.days_frequency ?? [];
  const days = chosen.filter((item) => item in WEEKDAYS);
  const windows = chosen.filter((item) => item in TIME_WINDOWS);
  const hours = [...new Set(medication.hours ?? [])].sort();
  return { days, windows, hours };
}

// Specific hours win, then time windows, otherwise one all-day slot, mirroring the form.
export function slotsFor(medication: Medication): Slot[] {
  const { windows, hours } = readRoutine(medication);
  if (medication.no_specific_time) return ["allDay"];
  if (hours.length > 0) {
    return hours.map((hour) => {
      const h = parseInt(hour, 10);
      return { label: hour, startHour: h, endHour: h };
    });
  }
  if (windows.length > 0) {
    return windows.map((window) => {
      const [startHour, endHour] = TIME_WINDOWS[window];
      return { label: window, startHour, endHour };
    });
  }
  return ["allDay"];
}

// Repeats on the chosen weekdays (or every day if all or none are picked) until the end date.
function recurrenceFor(medication: Medication): Calendar.RecurrenceRule {
  const { days } = readRoutine(medication);
  const endDate = medication.date_end ? toLocalDay(medication.date_end) : undefined;
  endDate?.setHours(23, 59, 59);

  if (days.length === 0 || days.length === 7) {
    return { frequency: Calendar.Frequency.DAILY, endDate };
  }
  return {
    frequency: Calendar.Frequency.WEEKLY,
    daysOfTheWeek: days.map((day) => ({ dayOfTheWeek: WEEKDAYS[day] })),
    endDate,
  };
}

// The first event has to land on a chosen weekday, otherwise iOS adds an extra one on the start date.
function firstDay(medication: Medication): Date {
  const { days } = readRoutine(medication);
  const day = toLocalDay(medication.date_start ?? new Date());
  if (days.length === 0 || days.length === 7) return day;

  const allowed = days.map((d) => WEEKDAYS[d] - 1); // JS: Sunday = 0
  while (!allowed.includes(day.getDay())) day.setDate(day.getDate() + 1);
  return day;
}

function eventsFor(medication: Medication): CalendarEventInput[] {
  const name = medication.name ?? "Medication";
  const notes = (medication.instructions ?? []).filter(Boolean).join("\n") || null;
  const recurrenceRule = recurrenceFor(medication);
  const day = firstDay(medication);

  return slotsFor(medication).map((slot) => {
    if (slot === "allDay") {
      const end = new Date(day);
      end.setHours(23, 59, 59);
      return { title: `Take ${name}`, startDate: day, endDate: end, allDay: true, notes, recurrenceRule };
    }
    const startDate = new Date(day);
    startDate.setHours(slot.startHour, 0, 0);
    const endDate = new Date(day);
    // A specific hour gets a 15 minute slot, a time window covers the whole window.
    if (slot.endHour === slot.startHour) endDate.setHours(slot.startHour, 15, 0);
    else endDate.setHours(slot.endHour, 0, 0);

    return { title: `Take ${name} · ${slot.label}`, startDate, endDate, notes, recurrenceRule };
  });
}

export async function addMedicationToCalendar(medication: Medication): Promise<void> {
  const eventIds: string[] = [];
  for (const event of eventsFor(medication)) {
    eventIds.push(await createCalendarEvent(event));
  }
  await saveCalendarLink("medication", medication.id, { eventId: null, eventIds, notificationIds: [] });
}

// The routine can change shape on edit (new days, different times), so replace the events rather than patch them.
export async function syncMedicationCalendar(medication: Medication): Promise<void> {
  const link = await getCalendarLink("medication", medication.id);
  if (!link) return;
  await Promise.all((link.eventIds ?? []).map(deleteCalendarEvent));
  await addMedicationToCalendar(medication);
}

export async function removeMedicationFromCalendar(medicationId: number): Promise<void> {
  const link = await getCalendarLink("medication", medicationId);
  if (!link) return;
  await Promise.all((link.eventIds ?? []).map(deleteCalendarEvent));
  await removeCalendarLink("medication", medicationId);
}