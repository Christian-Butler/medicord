import ScreenHeader from "@/components/screen-header";
import { getCalendarLink, removeCalendarLink, saveCalendarLink } from "@/src/libs/calenderLinks";
import { ensureNotificationPermission, type ReminderData } from "@/src/libs/notifications";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function reminderData(item: Notifications.NotificationRequest): Partial<ReminderData> {
  return (item.content.data ?? {}) as Partial<ReminderData>;
}

// Reads the time we stored on the reminder when it was scheduled.
function whenText(item: Notifications.NotificationRequest): string | null {
  const data = reminderData(item);
  if (data.at) {
    return new Date(data.at).toLocaleString([], {
      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  }
  if (data.hour !== undefined) {
    const time = `${String(data.hour).padStart(2, "0")}:00`;
    return data.weekday ? `${DAY_NAMES[data.weekday - 1]} at ${time}` : `Every day at ${time}`;
  }
  return null;
}

// Cancels one reminder and keeps the saved link in step, so edits and deletes don't try to cancel it again.
async function removeReminder(item: Notifications.NotificationRequest) {
  await Notifications.cancelScheduledNotificationAsync(item.identifier);

  const data = reminderData(item);
  if (!data.kind || !data.id) return;

  const kind = data.kind === "medication" ? "medication-alarm" : "appointment";
  const link = await getCalendarLink(kind, data.id);
  if (!link) return;

  const notificationIds = link.notificationIds.filter((id) => id !== item.identifier);
  // A medication with no alarms left can have "Create Alarm" tapped again.
  if (kind === "medication-alarm" && notificationIds.length === 0) {
    await removeCalendarLink(kind, data.id);
  } else {
    await saveCalendarLink(kind, data.id, { ...link, notificationIds });
  }
}

export default function NotificationsScreen() {
  const [permission, setPermission] = useState(false);
  const [scheduled, setScheduled] = useState<Notifications.NotificationRequest[]>([]);

  useEffect(() => {
    ensureNotificationPermission().then(setPermission);
  }, []);

  const loadScheduled = useCallback(async () => {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    setScheduled(all);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadScheduled();
    }, [loadScheduled])
  );

  async function handleRemove(item: Notifications.NotificationRequest) {
    await removeReminder(item);
    await loadScheduled();
  }

  async function scheduleTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Prescription",
        body: "You have received a prescription, available in Documents.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 20,
        repeats: false,
      },
    });
    await loadScheduled();
  }

  return (
    <View className="flex-1 bg-[#EEF9FB]">
      <ScreenHeader title="Notification center" />
      <View className="flex-1 mx-4 my-6">
        <Text className="text-xl font-medium">Scheduled</Text>

        <FlatList
          data={scheduled}
          keyExtractor={(item) => item.identifier}
          ListEmptyComponent={
            <Text className="mt-6 text-center text-[15px] text-[#7A8A8D]">
              No scheduled notifications.
            </Text>
          }
          renderItem={({ item }) => {
            const when = whenText(item);
            return (
              <View className="mt-6 flex-row items-center px-4 py-6 border-2 rounded-2xl border-[#0D5175] bg-white">
                <View className="w-14 items-center justify-center">
                  <MaterialIcons name="medical-information" size={48} color="#0D5175" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="flex-1 text-xl">{item.content.title}</Text>
                  {item.content.body ? <Text className="mt-2">{item.content.body}</Text> : null}
                  {when ? <Text className="mt-2 text-[#7A8A8D]">{when}</Text> : null}
                </View>
                <Pressable
                  onPress={() => handleRemove(item)}
                  hitSlop={12}
                  accessibilityLabel="Remove reminder"
                  className="ml-2"
                >
                  <MaterialIcons name="close" size={24} color="#0D5175" />
                </Pressable>
              </View>
            );
          }}
        />

        <TouchableOpacity
          className="mt-6 mb-6 items-center rounded-full bg-[#0D5175] px-4 py-3"
          disabled={!permission}
          onPress={scheduleTestNotification}
        >
          <Text className="font-semibold text-white">
            {permission ? "Send test notification" : "Notifications not enabled"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}