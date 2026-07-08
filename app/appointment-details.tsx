import { useAppointment } from "@/src/hooks/useAppointment";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import ScreenHeader from "@/components/screen-header";

const fallbackAvatar =
  "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg";


export default function AppointmentDetails() {
  const { appointmentId } = useLocalSearchParams<{
    appointmentId?: string;
  }>();

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
    doctor?.clinic_name ??
    "Location unavailable";

  const dateText = appointment
    ? formatAppointmentDate(appointment.starts_at)
    : "";

  const timeText = appointment
    ? formatAppointmentTime(appointment.starts_at)
    : "";
  return (
    <View style={styles.page}>
      <ScreenHeader title="Appointment details" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.statusText}>Loading appointment...</Text>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {appointment ? (
          <>
            <Text style={styles.confirmedText}>
              Medical appointment confirmed with
            </Text>

            <View style={styles.doctorRow}>
              <Image source={{ uri: avatar }} style={styles.avatar} />

              <View>
                <Text style={styles.doctorName}>{doctorName}</Text>
                <Text style={styles.specialty}>{specialty}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Transfer document prior to{"\n"}appointment
              </Text>

              <Pressable style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Import documents</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>When it is:</Text>

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

                  <Pressable style={styles.addCalendarButton}>
                    <Text style={styles.outlineButtonText}>
                      Add to Calendar
                    </Text>
                  </Pressable>
                </View>
              </View>

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
                <Text style={styles.primaryButtonText}>
                  Modify appointment date
                </Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Where to go:</Text>

              <Text style={styles.bodyText}>{location}</Text>

              <Pressable style={styles.outlineButton}>
                <Text style={styles.outlineButtonText}>Check on the map</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Who to contact</Text>

              <Text style={styles.bodyText}>
                Benbury’s cabinet secretary number:{"\n"}01 678 9123
              </Text>

              <Pressable style={styles.callButton}>
                <MaterialIcons name="phone" size={18} color="#0D5175" />
                <Text style={styles.callButtonText}>Call</Text>
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
    height: 36,
    width: "100%",
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 8,
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
    marginBottom: 28,
  },

  calendarIconWrap: {
    width: 70,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  whenRight: {
    flex: 1,
  },

  whenText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginBottom: 12,
  },

  addCalendarButton: {
    height: 36,
    width: "100%",
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    height: 46,
    width: "100%",
    backgroundColor: "#5085A8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
  },

  bodyText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    lineHeight: 21,
    marginBottom: 20,
  },

  callButton: {
    height: 36,
    width: "100%",
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 8,
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