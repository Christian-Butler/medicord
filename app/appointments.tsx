import CancelAppointmentOverlay from "@/components/cancel-appointment-overlay";
import ScreenHeader from "@/components/screen-header";
import { useAppointmentList } from "@/src/hooks/useAppointmentList";
import { useCancelAppointment } from "@/src/hooks/useCancelAppointment";
import type { Appointment } from "@/src/types/appointmentTypes";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();

  const location =
    appointment.location ??
    doctor?.location ??

    doctor?.clinic_name ?? t(`appointments.locUnavailable`);

  return (
    <View style={styles.appointmentRow}>

      <View style={styles.appointmentContent} className="mx-4 my-2 px-2 py-6 rounded-2xl bg-white">
        <View className="flex-row">
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View className="px-2 flex-1 flex-row justify-between">
            <View className="mb-4">
              <Text className="mb-1 text-[16px] font-medium text-black">{doctorName}</Text>
              <Text className="mb-1 text-gray-600 text-[16px] font-regular">{t(`appointments.${specialty}`)}</Text>
              <Text className="mb-1 text-gray-600 text-[16px] font-regular">
                {formatDateTime(appointment.starts_at)}
              </Text>
              <Text className="text-gray-600 text-[16px] font-regular">{location}</Text>
            </View>
            <Pressable
              className=""
              onPress={() =>
                router.push({
                  pathname: "/appointment-details",
                  params: {
                    appointmentId: appointment.id,
                  },
                })
              }
            >
              <Text className="text-[16px] font-medium text-[#5085A8]">{t(`appointments.details`)}</Text>
            </Pressable>
          </View>

        </View>

        <View className="flex-row">
          {type === "upcoming" ? (
            <>
              <Pressable className="self-end items-center justify-center h-[50px] px-6 py-2 rounded-[14px] bg-[#5085A8]">
                <Text className="text-[16px] font-medium text-[#0D5175]">{t(`appointments.calendar`)}</Text>
              </Pressable>

              <Pressable className="self-end items-center justify-center h-[50px] px-6 py-2 rounded-[14px] bg-[#5085A8]" onPress={onModify}>
                <Text className="text-[16px] font-medium text-white">{t(`appointments.modify`)}</Text>
              </Pressable>
            </>
          ) : (
            <Pressable className="self-end items-center justify-center h-[50px] px-6 py-2 rounded-[14px] bg-[#5085A8]">
              <Text className="text-[16px] font-medium text-white">{t(`appointments.prescription`)}</Text>
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

  const { t } = useTranslation();

  return (
    <View style={styles.page}>
      <ScreenHeader title={t(`appointments.appointments`)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.statusText}>{t(`appointments.loading`)}</Text>
        ) : null}

        {visibleError ? (
          <Text style={styles.errorText}>{t(`appointments.${visibleError}`)}</Text>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t(`appointments.upcoming`)}</Text>
        </View>

        {upcomingAppointments.length === 0 && !loading ? (
          <Text style={styles.emptyText}>{t(`appointments.noUpcoming`)}</Text>
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
          <Text style={styles.sectionTitle}>{t(`appointments.past`)}</Text>
        </View>

        {pastAppointments.length === 0 && !loading ? (
          <Text style={styles.emptyText}>{t(`appointments.noPast`)}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#EEF9FB",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },

  emptyText: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    color: "#333",
    fontSize: 15,
  },

  appointmentRow: {
    flexDirection: "row",
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
})