import DeleteModal from "@/components/delete-modal";
import LogoutModal from "@/components/logout-modal";
import { useProfile } from "@/src/hooks/useProfile";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ProfileRowProps = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  destructive?: boolean;
  onPress?: () => void;
};

function ProfileRow({ icon, title, subtitle, destructive = false, onPress }: ProfileRowProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 mt-4 min-h-[72px] flex-row items-center bg-white rounded-2xl px-5 py-3"
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={26}
          color={destructive ? "#E33434" : "#0D5175"}
          style={{ marginRight: 14 }}
        />
      ) : null}

      <View className="flex-1">
        <Text className={`text-[16px] font-regular ${destructive ? "text-[#E33434]" : "text-black"}`}>
          {t(`profile.${title}`)}
        </Text>

        {subtitle ? (
          <Text className="mt-1 text-[14px] font-regular text-gray-600">{subtitle}</Text>
        ) : null}
      </View>

      <MaterialIcons name="chevron-right" size={26} color={destructive ? "#E33434" : "#000"} />
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View className="pl-6 pt-7">
      <Text className="text-[20px] font-medium text-black">{title}</Text>
    </View>
  );
}

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { fullName, email, phone, dob, location, avatarUrl, handleEditAvatar } = useProfile();
  const { t } = useTranslation();
  console.log('[ProfilePage] avatarUrl:', avatarUrl);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#fff]">
      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => setShowLogoutModal(false)}
      />

      <DeleteModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => setShowDeleteModal(false)}
      />

      <View className="h-[72px] justify-end border-b-[2px] border-[#0D5175] bg-white pb-4">
        <Text className="text-center text-[24px] font-normal text-black">
          {t(`profile.profile`)}
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-[#EEF9FB]"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white border-b border-[#0D5175]">
          <Pressable onPress={handleEditAvatar}>
            <View className="relative items-center pb-8 pt-9">

              <View className="absolute right-6 top-6 flex-row items-center">
                <MaterialIcons name="edit" size={16} color="#8A3F00" />
                <Text className="ml-1 text-[16px] text-[#8A3F00]">{t(`profile.edit`)}</Text>
              </View>

              {avatarUrl ? (
                <Image
                  key={avatarUrl}
                  source={{ uri: avatarUrl }}
                  style={{ height: 74, width: 74, borderRadius: 37 }}
                />
              ) : (
                <View
                  style={{ height: 74, width: 74, borderRadius: 37, backgroundColor: '#D7E8ED' }}
                />

              )}

              <Text className="mt-6 text-[16px] font-normal text-black">{fullName}</Text>
              <Text className="mt-2 text-[16px] font-normal text-gray-600">{dob}</Text>
              <Text className="mt-2 text-[16px] font-normal text-gray-600">{location}</Text>
            </View>
          </Pressable>
        </View>

        <SectionTitle title={t(`profile.Authentification`)} />
        <ProfileRow icon="phone" title="Phone number" subtitle={phone} onPress={() => router.push("/security-details")} />
        <ProfileRow icon="mail-outline" title="Email address" subtitle={email} onPress={() => router.push("/security-details")} />
        <ProfileRow icon="lock-outline" title="Security details" onPress={() => router.push("/security-details")} />

        <SectionTitle title={t(`profile.Other settings`)} />
        <ProfileRow icon="language" title="Language (Local detection)" subtitle={t(`profile.English (UK)`)} />
        <ProfileRow title="Encrypted documents" subtitle={t(`profile.Active`)} />

        <SectionTitle title={t(`profile.Confidentiality`)} />
        <ProfileRow title="My preferences" onPress={() => router.push("/profile-preferences")} />
        <ProfileRow title="Legal information" onPress={() => router.push("/profile-legal")} />
        <ProfileRow
          title="Delete my account"
          onPress={() => setShowDeleteModal(true)}
        />

        <View className="h-[48px]" />

        <ProfileRow
          icon="logout"
          title="Disconnect"
          destructive
          onPress={() => setShowLogoutModal(true)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}