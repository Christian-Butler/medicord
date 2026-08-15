import { useAppointmentList } from "@/src/hooks/useAppointmentList";
import { formatAppointmentDateTime } from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const CARD_GAP = 14;

export default function UpcomingAppointments() {
  const { upcomingAppointments, loading, error } = useAppointmentList();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const cardWidth = width - 44;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / (cardWidth + CARD_GAP));
    setActiveIndex(Math.max(0, Math.min(nextIndex, upcomingAppointments.length - 1)));
  }

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
        <View style={[styles.emptyCard, { width: cardWidth }]}>
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
        snapToInterval={cardWidth + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        renderItem={({ item }) => {
          const doctorName = item.doctors?.full_name ?? item.title ?? "Appointment";
          const doctorSpecialty = item.doctors?.specialty ?? item.appointment_type ?? "Consultation";
          const avatarUrl = item.doctors?.avatar_url;

          return (
            <Pressable
              style={[styles.card, { width: cardWidth }]}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/appointment-details" as never,
                  params: { appointmentId: item.id },
                })
              }
            >
              <View style={styles.topRow}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri: avatarUrl ?? "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg",
                    }}
                    style={styles.avatar}
                  />
                </View>

                <View style={styles.doctorTextContainer}>
                  <Text numberOfLines={1} style={styles.doctorName}>
                    {doctorName}
                  </Text>
                  <Text numberOfLines={1} style={styles.doctorSpecialty}>
                    {doctorSpecialty}
                  </Text>
                </View>

                <MaterialIcons name="chevron-right" size={42} color="#000" style={styles.chevron} />
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

      {upcomingAppointments.length > 1 ? (
        <View style={styles.dotsContainer}>
          {upcomingAppointments.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      ) : null}
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
    minHeight: 110,
    borderWidth: 2,
    borderColor: "#0D5175",
    borderRadius: 18,
    backgroundColor: "#DDF8FF",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "#333",
  },
  dotsContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#0D5175",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#B7D4DE",
  },
});