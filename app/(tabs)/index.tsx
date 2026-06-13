import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfileHeader from "./../../components/header-profile"
import FindDoctor from "../../components/find-doctor"
import DoctorCarousel from "../../components/doctor-carousel"
import UpcomingAppointments from "../../components/upcoming-appointments"
import MedicationReminders from '../../components/medication-reminder'
import LatestDocuments from "../../components/latest-documents"
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
      <ProfileHeader />

      <View className="flex-1">
        <FindDoctor />
        <DoctorCarousel />
        <UpcomingAppointments />
        <MedicationReminders />
        <LatestDocuments />
      </View>
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
