import MedicationContainer from "@/components/medication-container";
import ScreenHeader from "@/components/screen-header";
import { Colors } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

export default function MedicationsPage() {

  const { t } = useTranslation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>
      <ScreenHeader title={t(`medications.medication`)} />
      <MedicationContainer />
    </ScrollView>
  );
}