import MedicationContainer from "@/components/medication-container";
import ScreenHeader from "@/components/screen-header";
import { ScrollView, StyleSheet } from "react-native";

export default function MedicationsPage() {
  return (
    <ScrollView style={styles.page}>
      <ScreenHeader title="Medication" />
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