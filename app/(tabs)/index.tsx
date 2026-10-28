import DoctorCarousel from "@/components/doctor-carousel";
import FindDoctor from "@/components/find-doctor";
import ProfileHeader from "@/components/header-profile";
import LatestDocuments from "@/components/latest-documents";
import MedicationReminder from "@/components/medication-reminder";
import UpcomingAppointments from "@/components/upcoming-appointments";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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