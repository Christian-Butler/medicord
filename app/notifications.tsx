import ScreenHeader from "@/components/screen-header";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

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
            const isGranted = permissionStatus === "granted";
            setPermission(isGranted);

            if (isGranted) {
                await scheduleTestNotification();
            }
        }
        configureNotifications();
    }, []);

    async function scheduleTestNotification() {
        await Notifications.cancelAllScheduledNotificationsAsync();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Prescription",
                body: "You have received a prescription, available in Documents.",
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 20,
                repeats: false
            }
        });
    }

    return (

        < View className="flex-1 bg-[#EEF9FB]" >
            <ScreenHeader title="Notification center" />
            <View className="flex-1 mx-4 my-6">
                <Text className="text-xl font-medium">Today</Text>
                <View>
                    <View className="mt-6 flex-row items-center px-4 py-6 border-2 rounded-2xl border-[#0D5175] bg-white">
                        <View className="w-14 items-center justify-center">
                            <MaterialIcons name="medical-information" size={48} color="#0D5175" />
                        </View>
                        <View className="ml-4 flex-1">
                            <View className="flex-row items-center justify-between">
                                <Text className="flex-1 text-xl font-regular">Notification title</Text>
                            </View>
                            <View className="mt-2">
                                <Text>Notification body</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    className="mt-6 mb-6 items-center rounded-full bg-[#0D5175] px-4 py-3"
                    disabled={!permission}
                    onPress={() => scheduleTestNotification()}
                >
                    <Text className="font-semibold text-white">
                        {permission ? "Send test notification" : "Notifications not enabled"}
                    </Text>
                </TouchableOpacity>
                <Text className="text-xl font-medium">

                </Text>
            </View>
        </View>
    );
};