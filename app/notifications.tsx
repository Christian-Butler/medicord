import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationsScreen() {
  const [permission, setPermission] = useState(false);
  const [scheduled, setScheduled] = useState<Notifications.NotificationRequest[]>([]);

  useEffect(() => {
    async function configureNotifications() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
      const existingPermissions = await Notifications.getPermissionsAsync();
      let permissionStatus = existingPermissions.status;

      if (permissionStatus !== "granted") {
        const requestedPermissions = await Notifications.requestPermissionsAsync();
        permissionStatus = requestedPermissions.status;
      }

      setPermission(permissionStatus === "granted");
    }
    configureNotifications();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function loadScheduled() {
        const all = await Notifications.getAllScheduledNotificationsAsync();
        setScheduled(all);
      }
      loadScheduled();
    }, [])
  );

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
          renderItem={({ item }) => (
            <View className="mt-6 flex-row items-center px-4 py-6 border-2 rounded-2xl border-[#0D5175] bg-white">
              <View className="w-14 items-center justify-center">
                <MaterialIcons name="medical-information" size={48} color="#0D5175" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="flex-1 text-xl">{item.content.title}</Text>
                {item.content.body ? (
                  <Text className="mt-2">{item.content.body}</Text>
                ) : null}
              </View>
            </View>
          )}
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