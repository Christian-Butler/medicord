import AppointmentReasonOverlay from "@/components/booking-reason";
import WeeklyCalendar from "@/components/calendar";
import HoursBooking from "@/components/hours-select";
import BookingSuccessOverlay from "@/components/success-booking";

import { createAppointment } from "@/src/api/appointments/api";
import { getDoctorsBySpecialty } from "@/src/api/doctors/api";

import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Doctor = {
  id: string;
  full_name: string;
  specialty: string | null;
  clinic_name: string | null;
  location: string | null;
  avatar_url?: string | null;
  requires_gp_referral?: boolean | null;
};

export default function Booking() {
  const { specialty } = useLocalSearchParams<{ specialty?: string }>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const [showReasonOverlay, setShowReasonOverlay] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Temporary values until WeeklyCalendar and HoursBooking return real selected values.
   */
  const selectedDate = "2026-06-20";
  const selectedTime = "10:00";

  useEffect(() => {
    async function loadDoctors() {
      console.log("[Booking] route specialty:", specialty);

      if (!specialty) {
        console.log("[Booking] no specialty param found");
        return;
      }

      try {
        setLoadingDoctors(true);
        setError(null);

        console.log("[Booking] fetching doctors for specialty:", String(specialty));

        const rows = await getDoctorsBySpecialty(String(specialty));

        console.log("[Booking] doctors returned:", rows);

        setDoctors(rows as Doctor[]);

        if (rows?.[0]) {
          console.log("[Booking] auto-selecting first doctor:", rows[0]);
          setSelectedDoctor(rows[0] as Doctor);
        }
      } catch (err) {
        console.error("[Booking] failed to load doctors:", err);
        setError(err instanceof Error ? err.message : "Failed to load doctors");
      } finally {
        setLoadingDoctors(false);
      }
    }

    loadDoctors();
  }, [specialty]);

  function toggleReason(reason: string) {
    setSelectedReasons((prev) => {
      const next = prev.includes(reason)
        ? prev.filter((item) => item !== reason)
        : [...prev, reason];

      console.log("[Booking] selectedReasons next:", next);

      return next;
    });
  }

  function handleOpenReasonOverlay() {
    console.log("[Booking] confirm booking pressed");
    console.log("[Booking] selectedDoctor before overlay:", selectedDoctor);

    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    setSelectedReasons([]);
    setError(null);
    setShowReasonOverlay(true);
  }

  async function handleConfirmReason() {
    console.log("[Booking] reason overlay confirm pressed");
    console.log("[Booking] selectedDoctor:", selectedDoctor);
    console.log("[Booking] selectedReasons:", selectedReasons);

    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    if (selectedReasons.length === 0) {
      setError("Please select at least one reason.");
      return;
    }

    try {
      setBooking(true);
      setError(null);

      const startsAt = new Date(`${selectedDate}T${selectedTime}:00.000Z`);
      const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);

      console.log("[Booking] startsAt:", startsAt.toISOString());
      console.log("[Booking] endsAt:", endsAt.toISOString());

      const input = {
        doctorId: selectedDoctor.id,
        gpId: null,
        referralRequired: selectedDoctor.requires_gp_referral ?? false,

        patientName: "Philip",
        patientEmail: "demo@medicord.test",
        patientPhone: "07123456789",

        reason: selectedReasons.join(", "),
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        location: selectedDoctor.location ?? null,
    };

      console.log("[Booking] createAppointment input:", input);

      const createdAppointment = await createAppointment(input);

      console.log("[Booking] createdAppointment returned:", createdAppointment);

      setShowReasonOverlay(false);
      setShowSuccessOverlay(true);
    } catch (err) {
      console.error("[Booking] create appointment failed:", err);

      setError(
        err instanceof Error ? err.message : "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  }

  return (
    <View className="flex-1 bg-[#EEF9FB]">
      <ScrollView>
        <View className="flex-1" style={{ height: 26 }} />

        <View style={styles.headerContainer}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹ Home</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            {specialty ?? "Book appointment"}
          </Text>

          <View style={{ width: 90 }} />
        </View>

        <View style={styles.doctorsContainer}>
          <Text style={styles.sectionTitle}>Select doctor</Text>

          {loadingDoctors ? (
            <Text style={styles.helperText}>Loading doctors...</Text>
          ) : null}

          {!loadingDoctors && doctors.length === 0 ? (
            <Text style={styles.helperText}>
              No doctors found for this specialty.
            </Text>
          ) : null}

          {doctors.map((doctor) => {
            const selected = selectedDoctor?.id === doctor.id;

            return (
              <Pressable
                key={doctor.id}
                onPress={() => {
                  console.log("[Booking] doctor selected:", doctor);
                  setSelectedDoctor(doctor);
                  setError(null);
                }}
                style={[
                  styles.doctorCard,
                  selected && styles.doctorCardSelected,
                ]}
              >
                <Text
                  style={[
                    styles.doctorName,
                    selected && styles.doctorTextSelected,
                  ]}
                >
                  {doctor.full_name}
                </Text>

                <Text
                  style={[
                    styles.doctorMeta,
                    selected && styles.doctorTextSelected,
                  ]}
                >
                  {doctor.specialty ?? specialty}
                </Text>

                <Text
                  style={[
                    styles.doctorMeta,
                    selected && styles.doctorTextSelected,
                  ]}
                >
                  {doctor.clinic_name ?? "Clinic"} ·{" "}
                  {doctor.location ?? "Location"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.monthContainer}>
          <Text style={{ fontSize: 22 }}>Select date</Text>

          <View style={styles.month}>
            <Text>Month selected: June</Text>
            <MaterialIcons name="keyboard-arrow-down" size={18} />
          </View>
        </View>

        <View style={{ marginBottom: 26 }}>
          <WeeklyCalendar />
        </View>

        <View>
          <HoursBooking />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.containerButton}>
          <Pressable
            accessibilityRole="button"
            disabled={booking}
            onPress={handleOpenReasonOverlay}
          >
            <Text style={styles.buttonText}>
              {booking ? "Booking..." : "Confirm booking"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppointmentReasonOverlay
        visible={showReasonOverlay}
        selectedReasons={selectedReasons}
        onToggleReason={toggleReason}
        onConfirm={handleConfirmReason}
        onClose={() => setShowReasonOverlay(false)}
      />

      <BookingSuccessOverlay
        visible={showSuccessOverlay}
        onAddToCalendar={() => {
          console.log("[Booking] add to calendar pressed");
        }}
        onGoHome={() => {
          console.log("[Booking] success overlay go home pressed");
          setShowSuccessOverlay(false);
          router.replace("/(tabs)");
        }}
        onClose={() => {
          console.log("[Booking] success overlay closed");
          setShowSuccessOverlay(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    borderRadius: 28,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#111",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },
  doctorsContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  doctorCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#DDF8FF",
    padding: 14,
    marginBottom: 12,
  },
  doctorCardSelected: {
    backgroundColor: "#09516D",
    borderColor: "#09516D",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  doctorMeta: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },
  doctorTextSelected: {
    color: "#fff",
  },
  month: {
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "#fff",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 10,
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  errorContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFECEC",
    padding: 12,
  },
  errorText: {
    color: "#B42318",
    fontSize: 14,
  },
  containerButton: {
    width: "96%",
    backgroundColor: "#5085A8",
    height: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});