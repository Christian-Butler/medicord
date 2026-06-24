import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DoctorCarousel from "../../components/doctor-carousel";
import FindDoctor from "../../components/find-doctor";
import LatestDocuments from "../../components/latest-documents";
import MedicationReminders from "../../components/medication-reminder";
import UpcomingAppointments from "../../components/upcoming-appointments";
import ProfileHeader from "./../../components/header-profile";

import { setDemoSession } from "../../src/features/auth/demo";
import { getMyUser } from "../../src/features/auth/user";

export default function HomeScreen() {
  const [profileName, setProfileName] = useState("Philip");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await setDemoSession();

        if (!user) {
          throw new Error("No demo user session found");
        }

        setUserId(user.id);

        const profile = await getMyUser();

        setProfileName(profile.full_name || "Philip");
      } catch (err) {
        setProfileName("Philip");
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    }

    loadProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#EEF9FB]" edges={["top"]}>
      <ProfileHeader name={profileName} />

      {__DEV__ && (
        <View className="bg-white px-6 pb-2">
          <Text className="text-xs text-gray-400">
            Demo User ID: {userId ?? "loading..."}
          </Text>

          {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
        </View>
      )}

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
