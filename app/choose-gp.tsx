import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Inputs, Sizes } from "@/constants/theme";
import { useDoctorsBySpecialty } from "@/src/hooks/useDoctorbySpecialty";
import { useProfile } from "@/src/hooks/useProfile";
import { useUpdateGp } from "@/src/hooks/useUpdateGp";
import { router, useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ChooseGp() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromOnboarding = from === "onboarding";

  const { doctors, loading, error } = useDoctorsBySpecialty("GP");
  const { gp } = useProfile();
  const { loading: updating, error: updateError, handleUpdateGp } = useUpdateGp();
  const [searchQuery, setSearchQuery] = useState("");
  const [timedQuery, setTimedQuery] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const queryGps = useMemo(() => {
    const trimmedSearchQuery = timedQuery.trim().toLowerCase();
    if (!trimmedSearchQuery) return doctors;
    return doctors.filter((doc) =>
      doc.full_name?.toLowerCase().includes(trimmedSearchQuery)
    );
  }, [doctors, timedQuery]);

  async function handleChooseGp(gpId: string) {
    const updated = await handleUpdateGp(gpId);
    if (!updated) return;

    if (fromOnboarding) router.replace("/(tabs)");
    else router.back();
  }

  return (
    <ScrollView style={styles.page}>
      <ScreenHeader title={t(`Change GP`)} showBack={!fromOnboarding} />

      

      <View
        style={{
          backgroundColor: Colors.bg2,
          borderColor: Colors.secondary,
          borderRadius: Sizes.p3,
          height: Inputs.height,
          marginHorizontal: Sizes.p2,
          paddingHorizontal: Sizes.p2,
          marginVertical: Sizes.p3,
          borderWidth: Inputs.w0,
        }}
        className="flex-row items-center"
      >
        <Search size={Sizes.h5} color={Colors.textMuted} />
        <TextInput
          placeholder={t(`Search for GP`)}
          placeholderTextColor={Colors.textMuted}
          style={{
            fontSize: Sizes.paragraph,
            color: Colors.text
          }}
          className="ml-2"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          returnKeyType="search"
        />
      </View>

      {loading ? <Text style={styles.statusText}>{t(`choose-gp.loading`)}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {updateError ? <Text style={styles.errorText}>{updateError}</Text> : null}
      {!loading && !error && queryGps.length === 0 ? (
        <Text style={styles.statusText}>{t(`choose-gp.noGp`)}</Text>
      ) : null}

      <View style={styles.containerMain}>
        {queryGps.map((doctor) => {
          const isCurrentGp = doctor.id === gp?.id;
          const avatar = doctor.avatar_url || null;

          return (
            <View key={doctor.id} style={styles.card}>
              <View style={styles.doctorInfo}>
                <View>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, { backgroundColor: Colors.textMuted }]} />
                  )}
                </View>

                <View className="flex-1">
                  <Text style={styles.name}>{doctor.full_name}</Text>
                  <View className="flex-row items-center">
                    <Text style={styles.profession}>
                      {doctor.clinic_name}
                    </Text>
                    <Text className="mx-1">
                      •
                    </Text>
                    <Text style={styles.profession}>
                      {doctor.location}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={styles.containerButton}
                className={isCurrentGp || updating ? "opacity-60" : ""}
                accessibilityRole="button"
                disabled={isCurrentGp || updating}
                onPress={() => handleChooseGp(doctor.id)}
              >
                <Text
                  style={{
                    color: Colors.bg2,
                    fontSize: Sizes.paragraph
                  }}
                  className="font-medium">
                  {isCurrentGp ? t(`Current GP`) : t(`Choose GP`)}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  intro: {
    marginTop: Sizes.p3,
    marginHorizontal: Sizes.p3,
    fontSize: Sizes.paragraph,
    color: Colors.text,
  },
  statusText: {
    alignSelf: "center",
    marginBottom: Sizes.p3,
    fontSize: Sizes.sm,
    color: Colors.text,
  },
  errorText: {
    alignSelf: "center",
    marginBottom: Sizes.p3,
    fontSize: Sizes.sm,
    color: Colors.error,
  },
  containerMain: {
    paddingHorizontal: Sizes.p3,
  },
  card: {
    backgroundColor: Colors.bg2,
    borderRadius: Sizes.h5,
    paddingHorizontal: Sizes.h5,
    paddingVertical: Sizes.sm,
    marginBottom: Sizes.h5,
  },
  doctorInfo: {
    flexDirection: 'row',
  },
  avatar: {
    width: Sizes.imgApt,
    height: Sizes.imgApt,
    borderRadius: Sizes.h1,
    marginRight: Sizes.p3,
  },
  name: {
    fontSize: Sizes.paragraph,
    fontWeight: "500",
  },
  profession: {
    marginTop: Buttons.w2,
    fontSize: Sizes.sm,
    fontWeight: "400",
  },
  containerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    height: Inputs.height,
    borderRadius: Sizes.sm,
    marginTop: Sizes.p3,
  }
});