import { addAppointmentToCalendar } from "@/src/libs/appointmentCalendar";
import { ensureCalendarPermission } from "@/src/libs/calender";
import { getCalendarLink } from "@/src/libs/calenderLinks";
import { ensureNotificationPermission } from "@/src/libs/notifications";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export function useAddAppointmentToCalendar() {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // show problems straight away, so screens don't need extra UI for them
  const fail = useCallback(
    (message: string) => {
      setError(message);
      Alert.alert(t("calendar.failedTitle", "Couldn't add to calendar"), message);
    },
    [t]
  );

  const addToCalendar = useCallback(
    async (appointment: Appointment): Promise<boolean> => {
      setAdding(true);
      setError(null);

      try {
        // already added on this phone: don't create a duplicate
        if (await getCalendarLink("appointment", appointment.id)) {
          Alert.alert(t("calendar.alreadyAdded", "Already in your calendar"));
          return true;
        }

        if (!(await ensureCalendarPermission())) {
          fail(t("calendar.permissionOff", "Calendar access is off. You can turn it on in Settings."));
          return false;
        }

        // reminders are optional: if notifications are off, the calendar event still stands
        const withReminders = await ensureNotificationPermission();
        const { remindersSet } = await addAppointmentToCalendar(appointment, withReminders);

        Alert.alert(
          t("calendar.added", "Added to your calendar"),
          remindersSet > 0
            ? t("calendar.remindersSet", "We'll also remind you before your appointment.")
            : undefined
        );
        return true;
      } catch (err) {
        fail(err instanceof Error ? err.message : t("calendar.failed", "Something went wrong. Please try again."));
        return false;
      } finally {
        setAdding(false);
      }
    },
    [t, fail]
  );

  return { addToCalendar, adding, error };
}