import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DoctorCarousel from "../../components/doctor-carousel";
import FindDoctor from "../../components/find-doctor";
import LatestDocuments from "../../components/latest-documents";
import MedicationReminders from "../../components/medication-reminder";
import UpcomingAppointments from "../../components/upcoming-appointments";
import ProfileHeader from "./../../components/header-profile";



export default function HomeScreen() {
  
  return (
    <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
      <ScrollView>
        <ProfileHeader />

        <View className="flex-1">
          <FindDoctor />
          <DoctorCarousel />
          <UpcomingAppointments />
          <MedicationReminders />
          <LatestDocuments />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
