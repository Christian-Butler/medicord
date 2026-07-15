// app/medication-routine.tsx
import MedicationFormContainer from "@/components/medication-form-container";
import ScreenHeader from "@/components/screen-header";
import { ScrollView, StyleSheet } from "react-native";

export default function MedicationRoutinePage() {
  return (
    <ScrollView style={styles.page}>
      <ScreenHeader title="Medication Routine" />
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