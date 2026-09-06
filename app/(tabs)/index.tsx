import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View } from "react-native";
import ProfileHeader from "@/components/header-profile";
import DoctorCarousel from "@/components/doctor-carousel";
import UpcomingAppointments from "@/components/upcoming-appointments";
import FindDoctor from "@/components/find-doctor";
import MedicationReminder from "@/components/medication-reminder";
import LatestDocuments from "@/components/latest-documents";

export default function Home() {
  return (
    <View className="flex-1 bg-[#EEF9FB]">
      <SafeAreaView edges={["top"]} className="bg-white">
        <ProfileHeader />
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <FindDoctor />
          <DoctorCarousel />
          <UpcomingAppointments />
          <MedicationReminder />
          <LatestDocuments />
        </View>
      </ScrollView>
    </View>
  );
}