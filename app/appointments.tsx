import CancelAppointmentOverlay from "@/components/cancel-appointment-overlay";
import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useAddAppointmentToCalendar } from "@/src/hooks/useaddAppointmentToCalendar";
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
  onAddToCalendar?: () => void;
};

function AppointmentRow({ appointment, type, onModify, onAddToCalendar }: AppointmentRowProps) {
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

      <View style={styles.appointmentContent}>
        <View className="flex-row">
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View
            style={{
              paddingHorizontal: Buttons.w2,
            }}
            className="flex-1 flex-row justify-between">
            <View
              style={{
                marginBottom: Sizes.p0,
              }}
            >
              <Text
                style={{
                  marginBottom: Buttons.w0,
                  fontSize: Sizes.paragraph,
                  color: Colors.text
                }}
                className="font-medium">{doctorName}</Text>
              <Text
                style={{
                  marginBottom: Buttons.w0,
                  color: Colors.textMuted,
                  fontSize: Sizes.paragraph
                }}
                className="font-regular">{t(`appointments.${specialty}`)}</Text>
              <Text
                style={{
                  marginBottom: Buttons.w0,
                  color: Colors.textMuted,
                  fontSize: Sizes.paragraph
                }}
                className="font-regular">
                {formatDateTime(appointment.starts_at)}
              </Text>
              <Text
                style={{
                  marginBottom: Sizes.p0,
                  color: Colors.textMuted,
                  fontSize: Sizes.paragraph
                }}
                className="font-regular">{location}</Text>
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
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: Sizes.paragraph
                }}
                className="font-medium">{t(`appointments.details`)}</Text>
            </Pressable>
          </View>

        </View>

        <View className="flex-row">
          {type === "upcoming" ? (
            <>
              <Pressable
                style={{
                  height: Buttons.height,
                  backgroundColor: Colors.bg2,
                  borderColor: Colors.secondary,
                  borderWidth: Buttons.w1,
                  borderRadius: Sizes.p3,
                  paddingHorizontal: Sizes.p3,
                  paddingVertical: Buttons.w2,
                  marginRight: Sizes.paragraph,
                }}
                className="self-end items-center justify-center" onPress={onAddToCalendar}>
                <Text
                  style={{
                    fontSize: Sizes.paragraph,
                    color: Colors.secondary
                  }}
                  className="font-medium">{t(`appointments.calendar`)}</Text>
              </Pressable>

              <Pressable
                style={{
                  height: Buttons.height,
                  paddingHorizontal: Sizes.h4,
                  paddingVertical: Buttons.w2,
                  borderRadius: Sizes.sm,
                  backgroundColor: Colors.primary
                }}
                className="self-end items-center justify-center" onPress={onModify}>
                <Text
                  style={{
                    fontSize: Sizes.paragraph,
                    color: Colors.bg2
                  }}
                  className="font-medium">{t(`appointments.modify`)}</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={{
                height: Buttons.height,
                paddingHorizontal: Sizes.h4,
                paddingVertical: Buttons.w2,
                borderRadius: Sizes.sm,
                backgroundColor: Colors.primary
              }}
              className="self-end items-center justify-center">
              <Text
                style={{
                  fontSize: Sizes.paragraph,
                  color: Colors.bg2
                }}
                className="font-medium">{t(`appointments.prescription`)}</Text>
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
  const { addToCalendar } = useAddAppointmentToCalendar();

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
            onAddToCalendar={() => addToCalendar(appointment)}
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
    backgroundColor: Colors.bg1,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  statusText: {
    paddingHorizontal: Sizes.paragraph,
    paddingVertical: Sizes.p3,
    color: Colors.text,
    fontSize: Sizes.sm,
  },

  errorText: {
    paddingHorizontal: Sizes.paragraph,
    paddingVertical: Sizes.p3,
    color: Colors.error,
    fontSize: Sizes.sm,
  },

  sectionHeader: {
    paddingHorizontal: Sizes.h4,
    paddingVertical: Sizes.paragraph,
    backgroundColor: Colors.bg1,
  },

  sectionTitle: {
    fontSize: Sizes.h4,
    fontWeight: "500",
    color: Colors.text,
  },

  emptyText: {
    paddingHorizontal: Sizes.h4,
    paddingVertical: Sizes.h5,
    color: Colors.text,
    fontSize: Sizes.paragraph,
  },

  appointmentRow: {
    flexDirection: "row",
  },

  avatar: {
    width: Sizes.imgNm,
    height: Sizes.imgNm,
    borderRadius: Sizes.IconNml,
    marginRight: Sizes.sm,
    backgroundColor: Colors.bg1,
  },

  appointmentContent: {
    borderRadius: Sizes.p3,
    backgroundColor: Colors.bg2,
    flex: 1,
    marginHorizontal: Sizes.p3,
    marginVertical: Sizes.p0,
    paddingHorizontal: Sizes.p2,
    paddingVertical: Sizes.paragraph
  },
})