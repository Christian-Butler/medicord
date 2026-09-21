import MedicationContainer from "@/components/medication-container";
import ScreenHeader from "@/components/screen-header";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export default function MedicationsPage() {

  const { t } = useTranslation();

  return (
    <ScrollView style={styles.page}>
      <ScreenHeader title={t(`medications.medication`)} />
      <MedicationContainer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#EEF9FB",
  },
});