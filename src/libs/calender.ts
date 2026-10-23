import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

export type CalendarEventInput = {
  title: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  location?: string | null;
  notes?: string | null;
  recurrenceRule?: Calendar.RecurrenceRule | null;
};

// Ask for calendar access only when the user taps an "add to calendar" button.
export async function ensureCalendarPermission(): Promise<boolean> {
  const current = await Calendar.getCalendarPermissionsAsync();
  if (current.status === "granted") return true;
  const requested = await Calendar.requestCalendarPermissionsAsync();
  return requested.status === "granted";
}

// iOS: the user's default calendar. Otherwise the first calendar we're allowed to write to.
async function getWritableCalendarId(): Promise<string> {
  if (Platform.OS === "ios") {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    if (defaultCalendar?.allowsModifications) return defaultCalendar.id;
  }
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((calendar) => calendar.allowsModifications);
  if (!writable) throw new Error("No calendar on this device can be edited.");
  return writable.id;
}

export async function createCalendarEvent(input: CalendarEventInput): Promise<string> {
  const calendarId = await getWritableCalendarId();
  return Calendar.createEventAsync(calendarId, {
    title: input.title,
    startDate: input.startDate,
    endDate: input.endDate,
    allDay: input.allDay ?? false,
    location: input.location ?? undefined,
    notes: input.notes ?? undefined,
    recurrenceRule: input.recurrenceRule ?? undefined,
  });
}

export async function updateCalendarEvent(eventId: string, changes: Partial<CalendarEventInput>): Promise<void> {
  await Calendar.updateEventAsync(eventId, {
    ...(changes.title !== undefined && { title: changes.title }),
    ...(changes.startDate !== undefined && { startDate: changes.startDate }),
    ...(changes.endDate !== undefined && { endDate: changes.endDate }),
    ...(changes.location !== undefined && { location: changes.location ?? undefined }),
    ...(changes.notes !== undefined && { notes: changes.notes ?? undefined }),
  });
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  try {
    await Calendar.deleteEventAsync(eventId);
  } catch {
    // Already deleted by the user in the Calendar app.
  }
}