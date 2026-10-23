import { useProfile } from "@/src/hooks/useProfile";
import { hasUnseenNotifications } from "@/src/libs/notifications";
import { router, useFocusEffect } from "expo-router";
import { Bell } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader() {
  const { fullName, avatarUrl } = useProfile();
  const { t } = useTranslation();
  const [unseen, setUnseen] = useState(false);

  // The dot only shows when a reminder has been added since the notification centre was last opened.
  useFocusEffect(
    useCallback(() => {
      hasUnseenNotifications().then(setUnseen);
    }, [])
  );

  return (
    <View className="bg-white">
      <View className="flex-row items-center justify-between px-6 pb-6 pt-5">
        <View className="flex-1 flex-row items-center">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ height: 64, width: 64, borderRadius: 32 }}
            />
          ) : (
            <View style={{ height: 64, width: 64, borderRadius: 32, backgroundColor: '#D7E8ED' }} />
          )}

          <View className="ml-7 mr-4 flex-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className="text-[24px] font-normal text-black"
            >
              {t(`header-profile.welcome`)}, {fullName}
            </Text>
          </View>
        </View>

        <TouchableOpacity className="relative h-12 w-12 items-center justify-center rounded-full bg-[#0D5175]"
          onPress={() => router.push({ pathname: "/notifications" })}>
          <Bell size={26} color="white" />
          {unseen ? <View className="absolute -right-0 -top-1 h-4 w-4 rounded-full bg-[#E7BF3C]" /> : null}
        </TouchableOpacity>
      </View>

      <View className="h-1 bg-[#09516D]" />
    </View>
  );
}