import type { Medication } from "@/src/types/medicationTypes";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { useState } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useCreateAlarm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateAlarm(medication: Medication) {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        setError("Notification permission denied.");
        return;
      }

      const hour = medication.hours?.[0] ?? 9;
      const days = medication.days_frequency ?? [];
      const dayMap: Record<string, number> = {
        Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7,
      };

      if (days.length === 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Take ${medication.name ?? "medication"}`,
            body: medication.instructions?.join(", ") ?? "Time to take your medication.",
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute: 0,
          },
        });
      } else {
        for (const day of days) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Take ${medication.name ?? "medication"}`,
              body: medication.instructions?.join(", ") ?? "Time to take your medication.",
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday: dayMap[day],
              hour,
              minute: 0,
            },
          });
        }
      }

      Alert.alert("Alarm Created", "Your medication reminder has been set.", [{ text: "OK" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alarm.");
    } finally {
      setLoading(false);
    }
  }

  return { handleCreateAlarm, loading, error };
}