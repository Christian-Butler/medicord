import Map from "@/components/map";
import ScreenHeader from "@/components/screen-header";
import { Colors, Sizes } from "@/constants/theme";
import { useAddAppointmentToCalendar } from "@/src/hooks/useaddAppointmentToCalendar";
import { useAppointment } from "@/src/hooks/useAppointment";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

  const { addToCalendar, adding } = useAddAppointmentToCalendar();

  const doctor = appointment?.doctors;
  const doctorName = doctor?.full_name ?? "Unknown doctor";
  const specialty = doctor?.specialty ?? "Specialist";
  const avatar = doctor?.avatar_url ?? fallbackAvatar;

  const location = appointment?.location ?? doctor?.location;
  const locationText = [
    doctor?.clinic_name,
    location ? t(`appointment-details.${location}`) : null,
  ]
    .filter((value): value is string => Boolean(value))
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ") || t("appointment-details.noLocation");

  const [showMap, setShowMap] = useState(false);

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

              <Pressable className="h-[50] w-[100%] rounded-[12px] items-center justify-center bg-[#5085A8]">
                <Text className="font-medium text-[16px] color-[white]">{t(`appointment-details.import`)}</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(`appointment-details.when`)}</Text>

              <View style={styles.whenRow}>
                <View>
                  <MaterialIcons
                    name="calendar-month"
                    size={Sizes.IconLg}
                    color={Colors.primary}
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
                  style={styles.callButton}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({
                      pathname: "/chat-room",
                      params: { doctorId: appointment.doctor_id },
                    })
                  }
                >
                  <MaterialIcons name="message" size={Sizes.h5} color={Colors.secondary} />
                  <Text style={styles.callButtonText}>{t(`Message`)}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t(`appointment-details.where`)}</Text>
              <Text className="text-[16px] font-regular mb-6">{locationText}</Text>

              {showMap ? <Map /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: showMap }}
                onPress={() => setShowMap((visible) => !visible)}
                style={styles.outlineButton}
              >
                <MaterialIcons name="place" size={Sizes.h4} color={Colors.secondary} />
                <Text style={styles.outlineButtonText}>
                  {t(showMap ? "appointment-details.hideMap" : "appointment-details.map")}
                </Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <View
                style={{ marginTop: Sizes.p2 }}
                className="flex-row justify-between">
                <Pressable style={styles.primaryButton} disabled={!appointment || adding}
                  onPress={() => appointment && addToCalendar(appointment)}>
                  <MaterialIcons name="today" size={Sizes.h4} color={Colors.bg2} />
                  <Text style={styles.primaryButtonText}>
                    {t(`appointment-details.calendar`)}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.postpone}
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
                  <MaterialIcons name="edit-calendar" size={Sizes.h4} color={Colors.secondary} />
                  <Text style={styles.outlineButtonText}>
                    {t(`appointment-details.modify`)}
                  </Text>
                </Pressable>

              </View>

            </View>

            <View style={styles.section}>


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
    backgroundColor: Colors.bg1,
  },

  header: {
    height: 104,
    backgroundColor: Colors.bg2,
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Sizes.h2,
    paddingHorizontal: Sizes.h2,
  },

  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: Sizes.h2,
    fontWeight: "400",
    color: Colors.text,
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
    fontSize: Sizes.sm,
    color: Colors.text,
    marginBottom: Sizes.sm,
  },

  errorText: {
    fontSize: Sizes.sm,
    color: Colors.error,
    marginBottom: Sizes.sm,
  },

  confirmedText: {
    fontSize: Sizes.h4,
    fontWeight: "500",
    color: Colors.text,
    lineHeight: 25,
    marginBottom: 24,
  },

  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Sizes.IconNml,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 18,
  },

  doctorName: {
    fontSize: Sizes.h4,
    fontWeight: "500",
    color: Colors.text,
  },

  specialty: {
    fontSize: Sizes.paragraph,
    fontWeight: "400",
    color: Colors.text,
    marginTop: 2,
  },

  section: {
    marginBottom: 34,
  },

  sectionTitle: {
    fontSize: Sizes.h4,
    fontWeight: "500",
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 10,
  },

  postpone: {
    flexDirection: "row",
    gap: 8,
    height: 50,
    borderRadius: Sizes.p3,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    flexDirection: "row",
    gap: 8,
    height: 50,
    width: "100%",

    borderRadius: Sizes.p3,
    backgroundColor: Colors.bg2,
    alignItems: "center",
    justifyContent: "center",
  },

  outlineButtonText: {
    fontSize: Sizes.paragraph,
    fontWeight: "500",
    color: Colors.secondary,
  },

  whenRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  whenText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },

  whenRight: {
    flex: 1,
  },

  primaryButton: {
    flexDirection: "row",
    gap: 8,
    height: 50,
    backgroundColor: "#5085A8",
    paddingHorizontal: 22,
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
  messageButton: {
    height: 50,
    width: "100%",
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
});