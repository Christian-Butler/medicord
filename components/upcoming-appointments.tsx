import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useAppointmentList } from "@/src/hooks/useAppointmentList";
import { formatAppointmentDateTime } from "@/src/utils/dateTime";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

const CARD_GAP = 14;

export default function UpcomingAppointments() {
  const { upcomingAppointments, loading, error } = useAppointmentList();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = useWindowDimensions();
  const cardWidth = width - 36;
  const { t } = useTranslation();

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / (cardWidth + CARD_GAP));
    setActiveIndex(Math.max(0, Math.min(nextIndex, upcomingAppointments.length - 1)));
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{t(`upcoming-appointments.Upcoming Appointments`)}</Text>
        <Text style={styles.statusText}>{t(`upcoming-appointments.Loading appointments...`)}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{t(`upcoming-appointments.Upcoming Appointments`)}</Text>
        <Text style={styles.errorText}>{t(`upcoming-appointments.${error}`)}</Text>
      </View>
    );
  }

  if (upcomingAppointments.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.title}>{t(`upcoming-appointments.Upcoming Appointments`)}</Text>
        <View style={[styles.emptyCard, { width: cardWidth }]}>
          <Text style={styles.emptyText}>{t(`upcoming-appointments.No upcoming appointments`)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t(`upcoming-appointments.Upcoming Appointments`)}</Text>

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
            <View
              style={[styles.card, { width: cardWidth }]}
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
                    {t(`upcoming-appointments.${doctorSpecialty}`)}
                  </Text>
                  <Text numberOfLines={1} style={styles.dateText}>
                    {formatAppointmentDateTime(item.starts_at)}
                  </Text>
                </View>
              </View>


              <View className="flex-row justify-between">
                <TouchableOpacity onPress={() =>
                  router.push({
                    pathname: "/edit-appointment" as never,
                    params: { appointmentId: item.id },
                  })
                }>
                  <View
                    style={{
                      marginTop: Sizes.p3,
                      backgroundColor: Colors.bg2,
                      borderColor: Colors.secondary,
                      borderWidth: Buttons.w2,
                      paddingHorizontal: Sizes.paragraph,
                      paddingVertical: Sizes.p3,
                      borderRadius: Sizes.p3
                    }}>
                    <Text
                      style={{
                        fontSize: Sizes.paragraph,
                        color: Colors.secondary
                      }}
                      className="font-medium">{t("upcoming-appointments.reschedule")}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>
                  router.push({
                    pathname: "/appointment-details" as never,
                    params: { appointmentId: item.id },
                  })
                }>
                  <View
                    style={{
                      marginTop: Sizes.p3,
                      backgroundColor: Colors.primary,
                      borderColor: Colors.primary,
                      borderWidth: Buttons.w2,
                      paddingHorizontal: Sizes.paragraph,
                      paddingVertical: Sizes.p3,
                      borderRadius: Sizes.p3
                    }}
                  >
                    <Text
                      style={{
                        fontSize: Sizes.paragraph,
                        color: Colors.bg2
                      }}
                      className="font-medium">{t("upcoming-appointments.details")}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
    marginTop: Sizes.h3,
  },
  title: {
    fontSize: Sizes.h2,
    fontWeight: "medium",
    color: Colors.text,
    marginLeft: Sizes.paragraph,
    marginBottom: Sizes.h5,
  },
  carouselContent: {
    paddingLeft: Sizes.h5,
  },
  card: {
    minHeight: 134,
    borderRadius: Sizes.h5,
    backgroundColor: Colors.bg2,
    paddingHorizontal: Sizes.h5,
    paddingTop: Sizes.h5,
    paddingBottom: Sizes.h3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: Sizes.imgApt,
    height: Sizes.imgApt,
    borderRadius: Sizes.IconLg,
    overflow: "hidden",
    backgroundColor: Colors.bg1,
    marginRight: Sizes.p2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  doctorTextContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: Sizes.h5,
    fontWeight: "500",
    color: Colors.text,
  },
  doctorSpecialty: {
    fontSize: Sizes.paragraph,
    fontWeight: "400",
    color: Colors.text,
  },
  dateText: {
    color: Colors.textMuted,
    fontSize: Sizes.sm,
    marginTop: Buttons.w0
  },
  statusText: {
    marginLeft: Sizes.p2,
    color: Colors.text,
    fontSize: Sizes.sm,
  },
  errorText: {
    marginLeft: Sizes.p2,
    color: Colors.error,
    fontSize: Sizes.paragraph,
  },
  emptyCard: {
    minHeight: Sizes.h1,
    marginTop: Sizes.h4,
    marginLeft: Sizes.h4
  },
  emptyText: {
    fontSize: Sizes.paragraph,
    color: Colors.text,
  },
  dotsContainer: {
    marginTop: Sizes.paragraph,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    height: Sizes.p1 + 2,
    borderRadius: Sizes.p0,
    marginHorizontal: Sizes.p0,
  },
  dotActive: {
    width: Sizes.h3,
  },
  dotInactive: {
    width: Sizes.p1 + 2,
    backgroundColor: Colors.bg2,
  },
});