import ScreenHeader from "@/components/screen-header";
import SpecialityContainer from "@/components/speciality-container";

import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useProfile } from "@/src/hooks/useProfile";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
export default function SpecialistPage() {

  const { t } = useTranslation();
    const { gp } = useProfile();

  const { specialty } = useLocalSearchParams<{
    specialty?: string;
  }>();

  if (!specialty) {
    return (
      <View
        style={{
          backgroundColor: Colors.bg1
        }}
        className="flex-1 items-center justify-center">
        <Text>{t(`book-appointment.missing`)}</Text>
      </View>
    );
  }
  const specialtyTitle = Array.isArray(specialty)
    ? specialty[0]
    : specialty ?? "Specialists";

  return (
    <ScrollView style={styles.page}>
      <ScreenHeader title={t(`book-appointment.${specialtyTitle}`)} />

      {specialtyTitle === "GP" ? (
        <View style={styles.gpRow}>
          <Text style={styles.gpText}>
            {t(`specialist-page.yourGp`)} {gp?.full_name ?? t(`specialist-page.noGp`)}
          </Text>
          <Pressable
            style={styles.changeGpButton}
            accessibilityRole="button"
            onPress={() => router.push("/choose-gp")}
          >
            <Text style={styles.changeGpText}>{t(`specialist-page.changeGp`)}</Text>
          </Pressable>
        </View>
      ) : null}

      <SpecialityContainer specialty={String(specialty)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  header: {
    height: 110,
    backgroundColor: Colors.bg2,
    borderBottomWidth: Buttons.w1,
    borderBottomColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Sizes.h2,
    paddingHorizontal: Sizes.h3,
  },
  backButton: {
    width: Sizes.IconLg - 2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: Sizes.h3,
    fontWeight: "400",
    color: Colors.text,
  },
  headerSpacer: {
    width: Sizes.IconLg - 2,
  },
   gpRow: {
    marginHorizontal: Sizes.p2,
    marginTop: Sizes.p3,
  },
  gpText: {
    fontSize: Sizes.paragraph,
    color: Colors.text,
    marginBottom: Sizes.p2,
  },
  changeGpButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg2,
    borderWidth: Buttons.w1,
    borderColor: Colors.secondary,
    height: Buttons.height,
    borderRadius: Sizes.sm,
  },
  changeGpText: {
    color: Colors.secondary,
    fontSize: Sizes.paragraph,
    fontWeight: "500",
  },
});