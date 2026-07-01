import { getMyAppointments } from "@/src/api/appointments/api";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    try {
      const data = await getMyAppointments();
      setAppointments(data ?? []);
    } catch (error) {
      console.log("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) {
    return (
      <View className="mx-6 mt-5 rounded-2xl bg-white p-4">
        <Text className="text-base text-black">Loading appointments...</Text>
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View className="mx-6 mt-5 rounded-2xl bg-white p-4">
        <Text className="text-lg font-semibold text-black">
          Upcoming Appointments
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          No upcoming appointments yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="mx-6 mt-5 rounded-2xl bg-white p-4">
      <Text className="mb-3 text-lg font-semibold text-black">
        Upcoming Appointments
      </Text>

      {appointments.map((appointment) => {
        const providerName =
          appointment.doctors?.full_name ??
          appointment.gps?.full_name ??
          "Provider";

        return (
          <View
            key={appointment.id}
            className="mb-3 rounded-xl bg-[#EEF9FB] p-4"
          >
            <Text className="text-base font-semibold text-black">
              {providerName}
            </Text>

            <Text className="mt-1 text-sm text-gray-600">
              {appointment.reason || appointment.title}
            </Text>

            <Text className="mt-1 text-sm text-gray-600">
              {new Date(appointment.starts_at).toLocaleString()}
            </Text>

            <Text className="mt-2 text-sm font-medium text-[#09516D]">
              Status: {appointment.status}
            </Text>
          </View>
        );
      })}
    </View>
  );
}