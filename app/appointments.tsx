import CancelAppointmentOverlay from "@/components/cancel-appointment-overlay";
import ScreenHeader from "@/components/screen-header";
import { useAppointmentList } from "@/src/hooks/useAppointmentList";
import { useCancelAppointment } from "@/src/hooks/useCancelAppointment";
import type { Appointment } from "@/src/types/appointmentTypes";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const fallbackAvatar =
  "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg";

function formatDateTime(value: string) {
  const date = new Date(value);

  const dateText = date.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const timeText = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateText}, at ${timeText}`;
}

type AppointmentRowProps = {
  appointment: Appointment;
  type: "upcoming" | "past";
  onModify?: () => void;
};

function AppointmentRow({ appointment, type, onModify }: AppointmentRowProps) {
  const doctor = appointment.doctors;
  const doctorName = doctor?.full_name ?? "Unknown doctor";
  const specialty = doctor?.specialty ?? appointment.appointment_type ?? "";
  const avatar = doctor?.avatar_url ?? fallbackAvatar;

  const location =
    appointment.location ??
    doctor?.location ??
    doctor?.clinic_name ??
    "Location unavailable";

  return (
    <View style={styles.appointmentRow}>
      <Image source={{ uri: avatar }} style={styles.avatar} />

      <View style={styles.appointmentContent}>
        <View style={styles.topLine}>
          <View>
            <Text style={styles.doctorName}>{doctorName}</Text>
            <Text style={styles.specialty}>{specialty}</Text>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/appointment-details",
                params: {
                  appointmentId: appointment.id,
                },
              })
            }
          >
            <Text style={styles.viewDetails}>View details</Text>
          </Pressable>
        </View>

        <Text style={styles.appointmentDate}>
          {formatDateTime(appointment.starts_at)}
        </Text>

        <Text style={styles.location}>{location}</Text>

        <View style={styles.buttonRow}>
          {type === "upcoming" ? (
            <>
              <Pressable style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Add to Calendar</Text>
              </Pressable>

              <Pressable style={styles.filledButton} onPress={onModify}>
                <Text style={styles.filledButtonText}>Modify</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>Prescription</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export default function Appointments() {
  const {
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    refetch,
  } = useAppointmentList();

  const { cancelById, cancelling, cancelError } = useCancelAppointment(refetch);

  const [selectedAppointmentForAction, setSelectedAppointmentForAction] =
    useState<Appointment | null>(null);

  function closeAppointmentActionOverlay() {
    if (cancelling) return;
    setSelectedAppointmentForAction(null);
  }

  function handlePostponeAppointment() {
    if (!selectedAppointmentForAction) return;

    const appointmentId = selectedAppointmentForAction.id;

    setSelectedAppointmentForAction(null);

    router.push({
      pathname: "/edit-appointment",
      params: {
        appointmentId,
      },
    });
  }

  async function handleCancelAppointment() {
    if (!selectedAppointmentForAction) return;

    try {
      await cancelById(selectedAppointmentForAction.id);
      setSelectedAppointmentForAction(null);
    } catch (err) {
      console.error("[appointmentsPage] cancel failed:", err);
    }
  }

  const visibleError = error ?? cancelError;

  return (
    <View style={styles.page}>
      <ScreenHeader title="Appointments" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.statusText}>Loading appointments...</Text>
        ) : null}

        {visibleError ? (
          <Text style={styles.errorText}>{visibleError}</Text>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
        </View>

        {upcomingAppointments.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No upcoming appointments.</Text>
        ) : null}

        {upcomingAppointments.map((appointment) => (
          <AppointmentRow
            key={appointment.id}
            appointment={appointment}
            type="upcoming"
            onModify={() => setSelectedAppointmentForAction(appointment)}
          />
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Past</Text>
        </View>

        {pastAppointments.length === 0 && !loading ? (
          <Text style={styles.emptyText}>No past appointments.</Text>
        ) : null}

        {pastAppointments.map((appointment) => (
          <AppointmentRow
            key={appointment.id}
            appointment={appointment}
            type="past"
          />
        ))}
      </ScrollView>

      <CancelAppointmentOverlay
        visible={!!selectedAppointmentForAction}
        cancelling={cancelling}
        onClose={closeAppointmentActionOverlay}
        onPostpone={handlePostponeAppointment}
        onCancelAppointment={handleCancelAppointment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#EEF9FB",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  statusText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#333",
    fontSize: 14,
  },

  errorText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#B42318",
    fontSize: 14,
  },

  sectionHeader: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#C9DDE3",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#EEF9FB",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },

  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    color: "#333",
    fontSize: 15,
  },

  appointmentRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#D0E2E7",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
    backgroundColor: "#D7E8ED",
  },

  appointmentContent: {
    flex: 1,
  },

  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  doctorName: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },

  specialty: {
    fontSize: 15,
    color: "#000",
  },

  viewDetails: {
    fontSize: 13,
    color: "#0D5175",
    fontWeight: "500",
  },

  appointmentDate: {
    marginTop: 8,
    fontSize: 15,
    color: "#000",
  },

  location: {
    marginTop: 2,
    fontSize: 14,
    color: "#000",
    lineHeight: 19,
  },

  buttonRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  outlineButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#0D5175",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  outlineButtonText: {
    color: "#0D5175",
    fontSize: 14,
    fontWeight: "500",
  },

  filledButton: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: "#5085A8",
    alignItems: "center",
    justifyContent: "center",
  },

  filledButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});