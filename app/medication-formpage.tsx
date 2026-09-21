// app/medication-routine.tsx
import MedicationFormContainer from "@/components/medication-form-container";
import ScreenHeader from "@/components/screen-header";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";

export default function MedicationRoutinePage() {

  const { t } = useTranslation();

  return (
    <ScrollView style={styles.page}>
      <ScreenHeader title={t(`medication-formpage.title`)} />
      <MedicationFormContainer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#EEF9FB",
  },
});