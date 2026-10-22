import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// How notifications behave while the app is open. Set once, app-wide.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Ask for permission only when the user does something that needs it.
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
  return requested.status === "granted";
}

// Attached to every reminder so the notification centre knows what it's for and when it fires.
export type ReminderData = {
  kind: "appointment" | "medication";
  id: string;
  endsAt?: string; // medication end date, used to clear expired alarms
  at?: string; // one-off reminders (appointments)
  hour?: number; // repeating reminders (medications)
  weekday?: number; // Sunday = 1; missing means every day
};

export async function scheduleReminder(at: Date, title: string, body: string, data: ReminderData): Promise<string> {
  await markNotificationsUnseen();
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: { ...data, at: at.toISOString() }, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at },
  });
}

export async function cancelReminders(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

// trigger: null shows it immediately: the same system banner as the test "Prescription" notification.
export async function showBanner(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({ content: { title, body, sound: true }, trigger: null });
}

// Drives the dot on the bell: set when a reminder is added, cleared when the notification centre is opened.
const UNSEEN_KEY = "medicord:notifications-unseen";

export async function markNotificationsUnseen(): Promise<void> {
  await AsyncStorage.setItem(UNSEEN_KEY, "1").catch(() => {});
}

export async function clearNotificationsUnseen(): Promise<void> {
  await AsyncStorage.removeItem(UNSEEN_KEY).catch(() => {});
}

export async function hasUnseenNotifications(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(UNSEEN_KEY)) === "1";
  } catch {
    return false;
  }
}