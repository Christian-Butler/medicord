import DeleteModal from "@/components/delete-modal";
import LogoutModal from "@/components/logout-modal";
import { Buttons, Colors, Sizes } from "@/constants/theme";
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
      style={{
        marginHorizontal: Sizes.p3,
        marginTop: Sizes.p2,
        backgroundColor: Colors.bg2,
        borderRadius: Sizes.p3,
        paddingHorizontal: Sizes.p2,
        paddingVertical: Buttons.w1,
      }}
      className="min-h-[64px] flex-row items-center"
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={Sizes.h2}
          color={destructive ? Colors.delete : Colors.secondary}
          style={{ marginRight: 14 }}
        />
      ) : null}

      <View className="flex-1">
        <Text
          style={{
            fontSize: Sizes.paragraph,
          }}
          className={`font-regular ${destructive ? Colors.delete : Colors.text}`}>
          {t(`profile.${title}`)}
        </Text>

        {subtitle ? (
          <Text
            style={{
              fontSize: Sizes.sm,
              color: Colors.textMuted
            }}
            className="mt-1 font-regular">{subtitle}</Text>
        ) : null}
      </View>

      <MaterialIcons name="chevron-right" size={Sizes.h2} color={destructive ? Colors.delete : Colors.text} />
    </Pressable>
  );
}

function SectionTitle({ title }: { title: string }) {

  return (
    <View
      style={{
        paddingLeft: Sizes.paragraph,
        paddingTop: Sizes.h5
      }}>
      <Text
        style={{
          fontSize: Sizes.h4,
          color: Colors.text
        }}
        className="font-medium">{title}</Text>
    </View>
  );
}

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { fullName, email, phone, dob, avatarUrl, gp, handleEditAvatar } = useProfile();
  const { t } = useTranslation();
  console.log('[ProfilePage] avatarUrl:', avatarUrl);

  return (
    <SafeAreaView edges={["top"]}
      style={{
        backgroundColor: Colors.bg2
      }}
      className="flex-1">
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

      <View
        style={{
          paddingBottom: Sizes.paragraph,
          borderBottomWidth: Buttons.w1,
          backgroundColor: Colors.bg2,
          borderBottomColor: Colors.secondary,
          height: Sizes.boxS
        }}
        className="justify-end">
        <Text
          style={{
            fontSize: Sizes.h3,
            color: Colors.text
          }}
          className="text-center">
          {t(`profile.profile`)}
        </Text>
      </View>

      <ScrollView
        style={{
          backgroundColor: Colors.bg1
        }}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: Colors.bg2,
            borderBottomColor: Colors.secondary
          }}
          className="border-b">
          <Pressable onPress={handleEditAvatar}>
            <View
              style={{ paddingBottom: Sizes.h4, paddingTop: Sizes.h4 }}
              className="relative items-center">

              <View
                className="absolute right-6 top-6 flex-row items-center">
                <MaterialIcons name="edit" size={Sizes.paragraph} color={Colors.edit} />
                <Text
                  style={{
                    fontSize: Sizes.paragraph,
                    color: Colors.edit
                  }}
                  className="ml-1">{t(`profile.edit`)}</Text>
              </View>

              {avatarUrl ? (
                <Image
                  key={avatarUrl}
                  source={{ uri: `${avatarUrl}?t=${Date.now()}` }}
                  style={{ height: Sizes.boxS + 4, width: Sizes.boxS + 4, borderRadius: Sizes.IconLg }}
                  onLoad={() => console.log('[ProfilePage] image loaded')}
                  onError={(e) => console.log('[ProfilePage] image error:', e.nativeEvent.error)}
                />
              ) : (
                <View
                  style={{ height: Sizes.boxS + 4, width: Sizes.boxS + 4, borderRadius: Sizes.h1, backgroundColor: Colors.bg1 }}
                />

              )}

              <Text
                style={{
                  fontSize: Sizes.paragraph,
                  color: Colors.text,
                  marginTop: Buttons.w2
                }}>{fullName}</Text>
              <Text
                style={{
                  fontSize: Sizes.paragraph,
                  color: Colors.textMuted,
                  marginTop: Buttons.w2
                }}
              >{dob}</Text>
              {/*   <Text
                style={{
                  fontSize: Sizes.paragraph,
                  color: Colors.textMuted,
                  marginTop: Buttons.w2
                }}
                className="mt-2">{location}</Text>*/}
            </View>
          </Pressable>
        </View>

        <SectionTitle title={t(`profile.Authentification`)} />
        <ProfileRow icon="phone" title="Phone number" subtitle={phone} onPress={() => router.push("/security-details")} />
        <ProfileRow icon="mail-outline" title="Email address" subtitle={email} onPress={() => router.push("/security-details")} />
        <ProfileRow icon="lock-outline" title="Security details" onPress={() => router.push("/security-details")} />
        <ProfileRow
          icon="local-hospital"
          title="Your GP"
          subtitle={gp?.full_name ?? t(`profile.No GP chosen`)}
          onPress={() => router.push("/choose-gp")}
        />

        <SectionTitle title={t(`profile.Other settings`)} />
        <View
          className="min-h-[64px] justify-center"
          style={{
            marginHorizontal: Sizes.p3,
            marginTop: Sizes.p3,
            borderRadius: Sizes.p3,
            paddingHorizontal: Sizes.p2,
            paddingVertical: Buttons.w2,
          }}>
          <Text
            style={{ fontSize: Sizes.paragraph }}>
            {t(`profile.languageTitle`)}
          </Text>
          <Text style={{ fontSize: Sizes.sm, color: Colors.textMuted }}
            className="mt-1 font-regular">
            {t(`profile.languageText`)}
          </Text>
        </View>
        <View
          className="min-h-[64px] justify-center"
          style={{
            marginHorizontal: Sizes.p3,
            marginTop: Sizes.p3,
            borderRadius: Sizes.p3,
            paddingHorizontal: Sizes.p2,
            paddingVertical: Buttons.w2,
          }}>
          <Text
            style={{ fontSize: Sizes.paragraph }}>
            {t(`profile.Encrypted documents`)}
          </Text>
          <Text style={{ fontSize: Sizes.sm, color: Colors.textMuted }}
            className="mt-1 font-regular">
            {t(`profile.Active`)}
          </Text>
        </View>

        <SectionTitle title={t(`profile.Confidentiality`)} />
        <ProfileRow title="My preferences" onPress={() => router.push("/profile-preferences")} />
        <ProfileRow title="Legal information" onPress={() => router.push("/profile-legal")} />
        <ProfileRow
          title="Delete my account"
          onPress={() => setShowDeleteModal(true)}
        />

        <View style={{
          height: Buttons.height
        }} />

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