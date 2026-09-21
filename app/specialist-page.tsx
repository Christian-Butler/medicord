import ScreenHeader from "@/components/screen-header";
import SpecialityContainer from "@/components/speciality-container";
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
      <View className="flex-1 items-center justify-center bg-[#EEF9FB]">
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
    backgroundColor: "#EEF9FB",
  },
  header: {
    height: 110,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#0D5175",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 28,
    paddingHorizontal: 22,
  },
  backButton: {
    width: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
  },
  headerSpacer: {
    width: 44,
  },
});