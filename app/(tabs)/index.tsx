import DoctorCarousel from "@/components/doctor-carousel";
import FindDoctor from "@/components/find-doctor";
import ProfileHeader from "@/components/header-profile";
import LatestDocuments from "@/components/latest-documents";
import MedicationReminder from "@/components/medication-reminder";
import UpcomingAppointments from "@/components/upcoming-appointments";
import { Colors } from "@/constants/theme";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <View style={{
      backgroundColor: Colors.bg1
    }}
      className="flex-1">
      <SafeAreaView edges={["top"]} style={{ backgroundColor: Colors.bg2 }}>
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