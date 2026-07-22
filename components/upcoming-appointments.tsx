import { useAppointmentList } from "@/src/hooks/useAppointmentList";
import { formatAppointmentDateTime } from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width - 44;

export default function UpcomingAppointments() {
  const {
    upcomingAppointments,
    loading,
    error,
  } = useAppointmentList();


  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <Text style={styles.statusText}>Loading appointments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No upcoming appointments</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Upcoming Appointments</Text>

      <FlatList
        horizontal
        data={upcomingAppointments}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 14}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
        renderItem={({ item }) => {
          const doctorName =
            item.doctors?.full_name ?? item.title ?? "Appointment";

          const doctorSpecialty =
            item.doctors?.specialty ?? item.appointment_type ?? "Consultation";

          const avatarUrl = item.doctors?.avatar_url;

          return (
            <Pressable
              style={styles.card}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/appointment-details" as never,
                  params: {
                    appointmentId: item.id,
                  },
                })
              }
            >
              <View style={styles.topRow}>
                <View style={styles.avatarWrapper}>
                  {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                  ) : (
                    <Image
                      source={{
                        uri: "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg",
                      }}
                      style={styles.avatar}
                    />
                  )}
                </View>

                <View style={styles.doctorTextContainer}>
                  <Text numberOfLines={1} style={styles.doctorName}>
                    {doctorName}
                  </Text>

                  <Text numberOfLines={1} style={styles.doctorSpecialty}>
                    {doctorSpecialty}
                  </Text>
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={42}
                  color="#000"
                  style={styles.chevron}
                />
              </View>

              <View style={styles.datePill}>
                <Text numberOfLines={1} style={styles.dateText}>
                  {formatAppointmentDateTime(item.starts_at)}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
    marginLeft: 16,
    marginBottom: 18,
  },
  carouselContent: {
    paddingLeft: 10,
    paddingRight: 22,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 134,
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 18,
    backgroundColor: "#DDF8FF",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#D7E8ED",
    marginRight: 20,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  doctorTextContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  doctorSpecialty: {
    fontSize: 22,
    fontWeight: "400",
    color: "#000",
    marginTop: 2,
  },
  chevron: {
    marginLeft: 8,
  },
  datePill: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#0D5A7C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    paddingHorizontal: 16,
  },
  dateText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  statusText: {
    marginLeft: 10,
    color: "#333",
    fontSize: 15,
  },
  errorText: {
    marginLeft: 10,
    color: "#B42318",
    fontSize: 15,
  },
  emptyCard: {
    width: CARD_WIDTH,
    minHeight: 110,
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 18,
    backgroundColor: "#DDF8FF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#333",
  },
});