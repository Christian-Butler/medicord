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
        backgroundColor: `${destructive ? Colors.delete : Colors.bg2}`,
        borderRadius: Sizes.p3,
        paddingHorizontal: Sizes.p2,
        paddingVertical: Buttons.w1,
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={Sizes.h2}
          color={destructive ? Colors.delete : Colors.secondary}
          style={{ marginRight: 14 }}
        />
      ) : null}

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: Sizes.paragraph,
            color: `${destructive ? Colors.bg2 : Colors.text}`,
            fontWeight: "500",
          }}
        >
          {t(`profile.${title}`)}
        </Text>

        {subtitle ? (
          <Text
            style={{
              fontSize: Sizes.sm,
              color: Colors.textMuted,
              marginTop: Sizes.p0,
            }}
          >{subtitle}</Text>
        ) : null}
      </View>

      <MaterialIcons name="chevron-right" size={Sizes.h2} color={destructive ? Colors.bg2 : Colors.text} />
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
          color: Colors.text,
          fontWeight: "500",
        }}
      >{title}</Text>
    </View>
  );
}

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { fullName, email, phone, dob, avatarUrl, gp, handleEditAvatar } = useProfile();
  console.log('[ProfilePage] avatarUrl:', avatarUrl);
  const { t } = useTranslation();


  return (
    <SafeAreaView edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: Colors.bg2
      }}
    >
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
          height: Sizes.boxS,
          justifyContent: "flex-end",
        }}>
        <Text
          style={{
            fontSize: Sizes.h3,
            color: Colors.text,
            textAlign: "center",
          }}
        >
          {t(`profile.profile`)}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: Colors.bg1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: Colors.bg2,
            borderBottomColor: Colors.secondary,
            borderBottomWidth: 1,
          }}>
          <Pressable onPress={handleEditAvatar}>
            <View
              style={{
                position: "relative",
                alignItems: "center",
                paddingBottom: Sizes.h4,
                paddingTop: Sizes.h4,
              }}>

              <View
                style={{
                  position: "absolute",
                  right: Sizes.h4,
                  top: Sizes.h4,
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <MaterialIcons name="edit" size={Sizes.paragraph} color={Colors.edit} />
                <Text
                  style={{
                    fontSize: Sizes.paragraph,
                    color: Colors.edit,
                    marginLeft: Sizes.p0,
                  }}
                >{t(`profile.edit`)}</Text>
              </View>

              {avatarUrl ? (
                <Image
                  key={avatarUrl}
                  source={{ uri: `${avatarUrl}?t=${Date.now()}` }}
                  style={{ height: Sizes.boxS + 4, width: Sizes.boxS + 4, borderRadius: Sizes.boxS }}
                  onLoad={() => console.log('[ProfilePage] image loaded')}
                  onError={(e) => console.log('[ProfilePage] image error:', e.nativeEvent.error)}
                />
              ) : (
                <View
                  style={{ height: Sizes.boxS + 4, width: Sizes.boxS + 4, borderRadius: Sizes.boxS, backgroundColor: Colors.bg1 }}
                />

              )}

              <Text
                style={{
                  fontSize: Sizes.h4,
                  color: Colors.text,
                  marginTop: Sizes.p2
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

        <SectionTitle title={t(`profile.Other settings`)} />
        <View
          style={{
            minHeight: 64,
            justifyContent: "center",
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
          <Text style={{ fontSize: Sizes.sm, color: Colors.textMuted, marginTop: Sizes.p0 }}>
            {t(`profile.languageText`)}
          </Text>
        </View>

        <SectionTitle title={t(`profile.Confidentiality`)} />
        {/* <ProfileRow title="My preferences" onPress={() => router.push("/profile-preferences")} />*/}
        <ProfileRow title="Legal information" onPress={() => router.push("/profile-legal")} />
        <ProfileRow
          icon="logout"
          title="Log out"
          onPress={() => setShowLogoutModal(true)}
        />


        <View style={{
          height: Sizes.h1
        }} />

        <ProfileRow
          destructive
          title="Delete my account"
          onPress={() => setShowDeleteModal(true)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}