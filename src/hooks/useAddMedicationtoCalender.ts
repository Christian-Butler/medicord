import { ensureCalendarPermission } from "@/src/libs/calender";
import { getCalendarLink } from "@/src/libs/calenderLinks";
import { addMedicationToCalendar } from "@/src/libs/medicationCalender";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export function useAddMedicationToCalendar() {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fail = useCallback(
    (message: string) => {
      setError(message);
      Alert.alert(t("calendar.failedTitle", "Couldn't add to calendar"), message);
    },
    [t]
  );

  const addToCalendar = useCallback(
    async (medication: Medication): Promise<boolean> => {
      setAdding(true);
      setError(null);
      try {
        // Already sent: don't create a second set of events.
        if (await getCalendarLink("medication", medication.id)) {
          Alert.alert(t("calendar.alreadyAdded", "Already in your calendar"));
          return true;
        }

        // The permission prompt only appears now, because the user tapped the button.
        if (!(await ensureCalendarPermission())) {
          fail(t("calendar.permissionOff", "Calendar access is off. You can turn it on in Settings."));
          return false;
        }

        await addMedicationToCalendar(medication);
        Alert.alert(
          t("calendar.added", "Added to your calendar"),
          t("calendar.medicationAdded", "Your routine will repeat on the days you chose until the end date.")
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