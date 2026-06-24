import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DoctorCarousel from "../../components/doctor-carousel";
import FindDoctor from "../../components/find-doctor";
import LatestDocuments from "../../components/latest-documents";
import MedicationReminders from '../../components/medication-reminder';
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

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });
