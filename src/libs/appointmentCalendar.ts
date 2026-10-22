import i18n from "@/src/libs/i18n";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
  type CalendarEventInput,
} from "@/src/libs/calender";
import {
  getCalendarLink,
  removeCalendarLink,
  saveCalendarLink,
} from "@/src/libs/calenderLinks";
import { cancelReminders, scheduleReminder } from "@/src/libs/notifications";
import type { Appointment } from "@/src/types/appointmentTypes";
import { toTimeValue } from "@/src/utils/dateTime";

const HOUR = 60 * 60 * 1000;

// Reminders before the appointment: a day before and an hour before.
const REMINDERS = [
  { before: 24 * HOUR, key: "dayBefore", fallback: "Appointment tomorrow" },
  { before: 1 * HOUR, key: "hourBefore", fallback: "Appointment in 1 hour" },
];

function doctorNameFor(appointment: Appointment) {
  return appointment.doctors?.full_name ?? i18n.t("calendar.yourDoctor", { defaultValue: "your doctor" });
}

// What the iOS Calendar event should say for this appointment.
function eventFor(appointment: Appointment): CalendarEventInput {
  const start = new Date(appointment.starts_at);
  const end = appointment.ends_at
    ? new Date(appointment.ends_at)
    : new Date(start.getTime() + HOUR / 2);

  return {
    title: `${i18n.t("calendar.appointmentWith", { defaultValue: "Appointment with" })} ${doctorNameFor(appointment)}`,
    startDate: start,
    endDate: end,
    location: appointment.location ?? appointment.doctors?.location ?? null,
    notes: appointment.reason,
  };
}

// Schedules the reminders that are still in the future and returns their ids.
async function scheduleRemindersFor(appointment: Appointment): Promise<string[]> {
  const start = new Date(appointment.starts_at).getTime();
  const ids: string[] = [];

  for (const reminder of REMINDERS) {
    const at = new Date(start - reminder.before);
    if (at.getTime() <= Date.now()) continue; // too late for this one

    ids.push(
      await scheduleReminder(
        at,
        i18n.t(`calendar.${reminder.key}`, { defaultValue: reminder.fallback }),
        `${doctorNameFor(appointment)} · ${toTimeValue(appointment.starts_at)}`,
        { kind: "appointment", id: appointment.id }
      )
    );
  }

  return ids;
}

// First time: create the event (and reminders if allowed) and remember them.
export async function addAppointmentToCalendar(
  appointment: Appointment,
  withReminders: boolean
): Promise<{ remindersSet: number }> {
  const eventId = await createCalendarEvent(eventFor(appointment));
  const notificationIds = withReminders ? await scheduleRemindersFor(appointment) : [];

  await saveCalendarLink("appointment", appointment.id, { eventId, notificationIds });
  return { remindersSet: notificationIds.length };
}

// After an edit: move the event and replace the reminders, if this phone added them.
export async function syncAppointmentCalendar(appointment: Appointment): Promise<void> {
  const link = await getCalendarLink("appointment", appointment.id);
  if (!link) return; // never added to the calendar on this phone

  if (link.eventId) await updateCalendarEvent(link.eventId, eventFor(appointment));

  await cancelReminders(link.notificationIds);
  const notificationIds = link.notificationIds.length > 0
    ? await scheduleRemindersFor(appointment)
    : [];

  await saveCalendarLink("appointment", appointment.id, { eventId: link.eventId, notificationIds });
}

// After a cancellation: remove the event and reminders, and forget the link.
export async function removeAppointmentFromCalendar(appointmentId: string): Promise<void> {
  const link = await getCalendarLink("appointment", appointmentId);
  if (!link) return;

  if (link.eventId) await deleteCalendarEvent(link.eventId);
  await cancelReminders(link.notificationIds);
  await removeCalendarLink("appointment", appointmentId);
}