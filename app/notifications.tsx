import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { getCalendarLink, removeCalendarLink, saveCalendarLink } from "@/src/libs/calenderLinks";
import { clearNotificationsUnseen, ensureNotificationPermission, type ReminderData } from "@/src/libs/notifications";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import type { TFunction } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";



const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function reminderData(item: Notifications.NotificationRequest): Partial<ReminderData> {
  return (item.content.data ?? {}) as Partial<ReminderData>;
}

// Reads the time we stored on the reminder when it was scheduled.
// Reads the time we stored on the reminder when it was scheduled.
function whenText(item: Notifications.NotificationRequest, t: TFunction): string | null {
  const data = reminderData(item);
  if (data.at) {
    return new Date(data.at).toLocaleString([], {
      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  }
  if (data.hour !== undefined) {
    const time = `${String(data.hour).padStart(2, "0")}:00`;
    return data.weekday
      ? `${t(`notifications.${DAY_NAMES[data.weekday - 1]}`)} ${time}`
      : `${t(`notifications.dayEach`)} ${time}`;
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
  const { t } = useTranslation();

  useEffect(() => {
    ensureNotificationPermission().then(setPermission);
  }, []);

  const loadScheduled = useCallback(async () => {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    setScheduled(all);
  }, []);

  // Opening the centre counts as having seen what's new, so the bell dot clears.
  useFocusEffect(
    useCallback(() => {
      loadScheduled();
      clearNotificationsUnseen();
    }, [loadScheduled])
  );

  async function handleRemove(item: Notifications.NotificationRequest) {
    await removeReminder(item);
    await loadScheduled();
  }

  async function scheduleTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t(`notifications.titleContent`),
        body: t(`notifications.nodyContent`),
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
    <View style={{ flex: 1, backgroundColor: Colors.bg1 }}>
      <ScreenHeader title="Notification center" />
      <View style={{ flex: 1, marginHorizontal: Sizes.h4, marginVertical: Sizes.h5 }}>
        <Text style={{ fontSize: Sizes.h5, fontWeight: "500", color: Colors.text }}>
          {t(`notifications.scheduled`)}
        </Text>

        <FlatList
          data={scheduled}
          keyExtractor={(item) => item.identifier}
          ListEmptyComponent={
            <Text style={{
              marginTop: Sizes.h5,
              textAlign: "center",
              fontSize: Sizes.paragraph,
              color: Colors.textMuted,
            }}>
              {t(`notifications.noSchedule`)}
            </Text>
          }
          renderItem={({ item }) => {
            const when = whenText(item, t);
            return (
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: Sizes.h5,
                borderWidth: 1,
                borderRadius: Sizes.p3 + Sizes.p1,
                borderColor: Colors.secondary,
                backgroundColor: Colors.bg2,
                paddingHorizontal: Sizes.h5,
                paddingVertical: Sizes.h4,
              }}>
                <View style={{ width: Sizes.width - 500, alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name="medical-information" size={Sizes.IconLg} color={Colors.secondary} />
                </View>
                <View style={{ flex: 1, marginLeft: Sizes.h4 }}>
                  <Text style={{ fontSize: Sizes.h5, fontWeight: '500', color: Colors.text }}>{item.content.title}</Text>
                  {item.content.body ? <Text style={{ fontSize: Sizes.sm, marginTop: Sizes.p0, color: Colors.text }}>{item.content.body}</Text> : null}
                  {when ? <Text style={{ fontSize: Sizes.sm, marginTop: Sizes.p0, color: Colors.textMuted }}>{when}</Text> : null}
                </View>
                <Pressable
                  onPress={() => handleRemove(item)}
                  hitSlop={12}
                  accessibilityLabel={t(`notifications.remove`)}
                  style={{ marginLeft: Sizes.p2 }}
                >
                  <MaterialIcons name="close" size={Sizes.h3} color={Colors.delete} />
                </Pressable>
              </View>
            );
          }}
        />

        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: Sizes.h5,
            marginBottom: Sizes.boxS,
            borderRadius: Sizes.IconLg,
            backgroundColor: Colors.secondary,
            paddingHorizontal: Sizes.h4,
            paddingVertical: Sizes.p3,
            height: Buttons.height
          }}
          disabled={!permission}
          onPress={scheduleTestNotification}
        >
          <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>
            {permission ? t(`notifications.test`) : t(`notifications.notEnabled`)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}