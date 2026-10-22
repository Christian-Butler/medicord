import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.DEFAULT,
        });
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.status === "granted") return true;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === "granted"
}

export type ReminderData = {
  kind: "appointment" | "medication";
    id: string;
    endsAt?: string;
   at?: string;      
  hour?: number;   
  weekday?: number; 
};

// Schedules one notification for a fixed date and time, and returns its id.
export async function scheduleReminder(
  at: Date,
  title: string,
  body: string,
  data: ReminderData
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: { ...data, at: at.toISOString() }, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at },
  });
}

export async function cancelReminders(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}