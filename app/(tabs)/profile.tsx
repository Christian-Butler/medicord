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
      className="min-h-[74px] flex-row items-center border-b border-[#B9CBCD] px-5 py-3"
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={22}
          color={destructive ? "#E33434" : "#326F95"}
          style={{ marginRight: 14 }}
        />
      ) : null}

      <View className="flex-1">
        <Text className={`text-[18px] font-normal ${destructive ? "text-[#E33434]" : "text-black"}`}>
          {t(`profile.${title}`)}
        </Text>

        {subtitle ? (
          <Text className="mt-1 text-[15px] font-normal text-black">{subtitle}</Text>
        ) : null}
      </View>

      <MaterialIcons name="chevron-right" size={26} color={destructive ? "#E33434" : "#000"} />
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View className="border-b border-[#B9CBCD] px-5 pb-3 pt-7">
      <Text className="text-[19px] font-semibold text-black">{title}</Text>
    </View>
  );
}

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { fullName, email, phone, dob, location, avatarUrl, handleEditAvatar } = useProfile();
  const { t } = useTranslation();
  console.log('[ProfilePage] avatarUrl:', avatarUrl);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#EEF9FB]">
      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => setShowLogoutModal(false)}
      />

      <View className="h-[72px] justify-end border-b-[2px] border-[#0D5175] bg-white pb-4">
        <Text className="text-center text-[24px] font-normal text-black">
          {t(`profile.profile`)}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative items-center border-b border-[#B9CBCD] pb-8 pt-9">
          <Pressable onPress={handleEditAvatar} className="absolute right-6 top-6 flex-row items-center">
            <MaterialIcons name="edit" size={16} color="#8A3F00" />
            <Text className="ml-1 text-[16px] text-[#8A3F00]">{t(`profile.edit`)}</Text>
          </Pressable>

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

          <Text className="mt-5 text-[17px] font-normal text-black">{fullName}</Text>
          <Text className="mt-3 text-[16px] font-normal text-black">{dob}</Text>
          <Text className="mt-3 text-[16px] font-normal text-black">{location}</Text>

        </View>

        <SectionTitle title={t(`profile.Authentification`)} />
        <ProfileRow icon="phone" title="Phone number" subtitle={phone} />
        <ProfileRow icon="mail-outline" title="Email address" subtitle={email} />
        <ProfileRow icon="lock-outline" title="Security details" onPress={() => router.push("/security-details")} />

        <SectionTitle title={t(`profile.Other settings`)} />
        <ProfileRow icon="language" title="Language (Local detection)" subtitle={t(`profile.English (UK)`)} />
        <ProfileRow title="Encrypted documents" subtitle={t(`profile.Active`)} />

        <SectionTitle title={t(`profile.Confidentiality`)} />
        <ProfileRow title="My preferences" onPress={() => router.push("/profile-preferences")} />
        <ProfileRow title="Legal information" onPress={() => router.push("/profile-legal")} />
        <ProfileRow title="Delete my account" />

        <View className="h-[64px] border-b border-[#B9CBCD]" />

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