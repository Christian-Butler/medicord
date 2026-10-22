import { getCalendarLink, removeCalendarLink, saveCalendarLink } from "@/src/libs/calenderLinks";
import { readRoutine, slotsFor, toLocalDay, WEEKDAYS } from "@/src/libs/medicationCalender";
import { cancelReminders, type ReminderData } from "@/src/libs/notifications";
import type { Medication } from "@/src/types/medicationTypes";
import * as Notifications from "expo-notifications";

// "No time window needed" still gets one nudge a day.
const NO_TIME_HOUR = 9;

function endsAtFor(medication: Medication): string | undefined {
  if (!medication.date_end) return undefined;
  const end = toLocalDay(medication.date_end);
  end.setHours(23, 59, 59);
  return end.toISOString();
}

// Same reading of the form as the calendar: specific hours, else window start times, else 09:00.
export async function createMedicationAlarms(medication: Medication): Promise<void> {
  const { days } = readRoutine(medication);
  const everyDay = days.length === 0 || days.length === 7;
  const hours = slotsFor(medication).map((slot) => (slot === "allDay" ? NO_TIME_HOUR : slot.startHour));

  const title = `Take ${medication.name ?? "medication"}`;
  const body = (medication.instructions ?? []).filter(Boolean).join(", ") || "Time to take your medication.";
  // Tagged so the notification centre knows what it's for, and we can cancel it later.
  const data: ReminderData = { kind: "medication", id: String(medication.id), endsAt: endsAtFor(medication) };

  const notificationIds: string[] = [];
  for (const hour of hours) {
    const weekdays: (number | undefined)[] = everyDay ? [undefined] : days.map((day) => WEEKDAYS[day]);

    for (const weekday of weekdays) {
      const trigger: Notifications.NotificationTriggerInput =
        weekday === undefined
          ? { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0 }
          : { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour, minute: 0 };

      notificationIds.push(
        await Notifications.scheduleNotificationAsync({
          content: { title, body, data: { ...data, hour, weekday }, sound: true },
          trigger,
        })
      );
    }
  }
  await saveCalendarLink("medication-alarm", medication.id, { eventId: null, notificationIds });
}

export async function syncMedicationAlarms(medication: Medication): Promise<void> {
  const link = await getCalendarLink("medication-alarm", medication.id);
  if (!link) return;
  await cancelReminders(link.notificationIds);
  await createMedicationAlarms(medication);
}

export async function removeMedicationAlarms(medicationId: number): Promise<void> {
  const link = await getCalendarLink("medication-alarm", medicationId);
  if (!link) return;
  await cancelReminders(link.notificationIds);
  await removeCalendarLink("medication-alarm", medicationId);
}

// Repeating alarms can't be given an end date, so on app open we clear any whose medication has ended.
export async function clearExpiredMedicationAlarms(): Promise<void> {
  const now = Date.now();
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const expired = new Set<string>();

  for (const request of scheduled) {
    const data = request.content.data as Partial<ReminderData> | undefined;
    if (data?.kind === "medication" && data.id && data.endsAt && new Date(data.endsAt).getTime() < now) {
      expired.add(data.id);
    }
  }
  for (const id of expired) await removeMedicationAlarms(Number(id));
}