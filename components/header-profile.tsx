import { Colors, Sizes } from "@/constants/theme";
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
    <View style={{
      backgroundColor: Colors.bg2,
      borderBottomWidth: 1.5,
      borderBottomColor: Colors.secondary
    }}>
      <View
        style={{
          paddingBottom: Sizes.p3,
          paddingHorizontal: Sizes.p3

        }}
        className="flex-row items-center justify-between pt-5">
        <View className="flex-1 flex-row items-center">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ height: Sizes.imgNm, width: Sizes.imgNm, borderRadius: Sizes.h1 }}
            />
          ) : (
            <View style={{ height: Sizes.imgNm, width: Sizes.imgNm, borderRadius: Sizes.h1, backgroundColor: Colors.bg1 }} />
          )}

          <View className="ml-7 mr-4 flex-1">
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: Sizes.h2,
                color: Colors.text
              }}
            >
              {t(`header-profile.welcome`)}, {fullName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{ backgroundColor: Colors.secondary }}
          className="relative h-12 w-12 items-center justify-center rounded-full bg-[#0D5175]"
          onPress={() => router.push({ pathname: "/notifications" })}>
          <Bell size={Sizes.h2} color={Colors.bg2} />
          {unseen ? <View className="absolute -right-0 -top-1 h-4 w-4 rounded-full bg-[#E7BF3C]" /> : null}
        </TouchableOpacity>
      </View>
    </View>
  );
}