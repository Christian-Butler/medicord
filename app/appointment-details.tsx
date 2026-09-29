import ScreenHeader from "@/components/screen-header";
import { useAppointment } from "@/src/hooks/useAppointment";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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


export default function AppointmentDetails() {
  const { appointmentId } = useLocalSearchParams<{
    appointmentId?: string;
  }>();

  const { t } = useTranslation();

  const {
    appointment,
    loading,
    error,
  } = useAppointment(appointmentId ? String(appointmentId) : undefined);

  const doctor = appointment?.doctors;
  const doctorName = doctor?.full_name ?? "Unknown doctor";
  const specialty = doctor?.specialty ?? "Specialist";
  const avatar = doctor?.avatar_url ?? fallbackAvatar;

  const location =
    appointment?.location ??
    doctor?.location ??
    doctor?.clinic_name ?? t(`appointment-details.noLocation`);

  const dateText = appointment
    ? formatAppointmentDate(appointment.starts_at)
    : "";

  const timeText = appointment
    ? formatAppointmentTime(appointment.starts_at)
    : "";

  return (
    <View style={styles.page}>
      <ScreenHeader title={t(`appointment-details.details`)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.statusText}>{t(`appointment-details.loading`)}</Text>
        ) : null}

        {error ? <Text style={styles.errorText}>{t(`appointment-details.${error}`)}</Text> : null}

        {appointment ? (
          <>
            <Text style={styles.confirmedText}>
              {t(`appointment-details.confirmed`)}
            </Text>

            <View style={styles.doctorRow}>
              <Image source={{ uri: avatar }} style={styles.avatar} />

              <View>
                <Text style={styles.doctorName}>{doctorName}</Text>
                <Text style={styles.specialty}>{t(`appointment-details.${specialty}`)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t(`appointment-details.transfer`)}

              </Text>

              <Pressable className="h-[50] w-[100%] border-2 border-[#0D5175] rounded-[12] items-center justify-center bg-white">
                <Text className="font-medium text-[16px] color-[#0D5175]">{t(`appointment-details.import`)}</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(`appointment-details.when`)}</Text>

              <View style={styles.whenRow}>
                <View style={styles.calendarIconWrap}>
                  <MaterialIcons
                    name="calendar-month"
                    size={48}
                    color="#5085A8"
                  />
                </View>

                <View style={styles.whenRight}>
                  <Text style={styles.whenText}>
                    {dateText} - {timeText}
                  </Text>

                </View>
              </View>

              <View className="mt-4 flex-row justify-between">

                <Pressable
                  style={styles.primaryButton}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: "/edit-appointment" as never,
                      params: {
                        appointmentId: appointment.id,
                      },
                    })
                  }
                >
                  <MaterialIcons name="edit-calendar" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>
                    {t(`appointment-details.modify`)}
                  </Text>
                </Pressable>

                <Pressable style={styles.addCalendarButton}>
                  <MaterialIcons name="today" size={20} color="#0D5175" />
                  <Text style={styles.outlineButtonText}>
                    {t(`appointment-details.calendar`)}
                  </Text>
                </Pressable>

              </View>

            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(`appointment-details.where`)}</Text>

              <Text className="text-[16px] font-regular mb-6">{t(`appointment-details.${location}`)}</Text>

              <Pressable style={styles.outlineButton}>
                <MaterialIcons name="place" size={20} color="#0D5175" />
                <Text style={styles.outlineButtonText}>{t(`appointment-details.map`)}</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(`appointment-details.who`)}</Text>

              <Text className="text-[16px] py-2">
                {t(`appointment-details.number`)}
              </Text>
              <Text className="text-[16px] mb-6">
                01 678 9123
              </Text>

              <Pressable style={styles.callButton}>
                <MaterialIcons name="phone" size={18} color="#0D5175" />
                <Text style={styles.callButtonText}>{t(`appointment-details.call`)}</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#EEF9FB",
  },

  header: {
    height: 104,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#0D5175",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 24,
  },

  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
  },

  headerSpacer: {
    width: 40,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 54,
  },

  statusText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 14,
  },

  errorText: {
    fontSize: 14,
    color: "#B42318",
    marginBottom: 14,
  },

  confirmedText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    lineHeight: 25,
    marginBottom: 24,
  },

  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 34,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 18,
  },

  doctorName: {
    fontSize: 21,
    fontWeight: "500",
    color: "#000",
  },

  specialty: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginTop: 2,
  },

  section: {
    marginBottom: 34,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
    lineHeight: 24,
    marginBottom: 20,
  },

  outlineButton: {
    flexDirection: "row",
    gap: 8,
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  outlineButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0D5175",
  },

  whenRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  calendarIconWrap: {
    width: 70,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  whenText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },

  whenRight: {
    flex: 1,
  },

  addCalendarButton: {
    flexDirection: "row",
    gap: 8,
    height: 50,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    flexDirection: "row",
    width: "44%",
    gap: 8,
    height: 50,
    backgroundColor: "#5085A8",
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },

  callButton: {
    height: 50,
    width: "100%",
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  callButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0D5175",
  },
});