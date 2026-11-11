import ScreenHeader from "@/components/screen-header";
import SpecialityContainer from "@/components/speciality-container";

import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SpecialistPage() {

  const { t } = useTranslation();

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
});