import { getCalendarLink } from "@/src/libs/calenderLinks";
import { createMedicationAlarms } from "@/src/libs/medicationAlarms";
import { ensureNotificationPermission, showBanner } from "@/src/libs/notifications";
import type { Medication } from "@/src/types/medicationTypes";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

export function useCreateAlarm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fail = useCallback(
    (message: string) => {
      setError(message);
      Alert.alert(t("alarm.failedTitle", "Couldn't set alarm"), message);
    },
    [t]
  );

  const handleCreateAlarm = useCallback(
    async (medication: Medication) => {
      setLoading(true);
      setError(null);
      try {
        // Error prevention: these need reading before carrying on, so they stay as popups.
        if (await getCalendarLink("medication-alarm", medication.id)) {
          Alert.alert(t("alarm.alreadySet", "Alarm already set"));
          return;
        }
        if (!(await ensureNotificationPermission())) {
          fail(t("alarm.permissionOff", "Notifications are off. You can turn them on in Settings."));
          return;
        }

        // Success is a banner, the same kind the reminders arrive as. Tapping it opens the notification centre.
        const schedule = await createMedicationAlarms(medication);
        await showBanner(
          t("alarm.createdFor", { defaultValue: "Alarm set for {{name}}", name: medication.name ?? "" }),
          schedule
        );
      } catch (err) {
        fail(err instanceof Error ? err.message : t("alarm.failed", "Something went wrong. Please try again."));
      } finally {
        setLoading(false);
      }
    },
    [t, fail]
  );

  return { handleCreateAlarm, loading, error };
}