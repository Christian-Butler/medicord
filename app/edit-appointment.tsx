import HoursBooking from "@/components/hours-select";
import ScreenHeader from "@/components/screen-header";
import BookingSuccessOverlay from "@/components/success-booking";
import WeeklyCalendar from "@/components/calendar";
import { useAppointment } from "@/src/hooks/useAppointment";
import { useUpdateAppointment } from "@/src/hooks/useUpdateAppointment";
import {
  buildLocalIsoDateTime,
  toLocalIsoDate,
  toLocalTimeValue,
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function EditAppointment() {
  const { appointmentId } = useLocalSearchParams<{
    appointmentId?: string;
  }>();

  const {
    appointment,
    loading,
    error: appointmentError,
  } = useAppointment(appointmentId ? String(appointmentId) : undefined);

  const { update, updating, updateError } = useUpdateAppointment();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    if (!appointment) return;

    setSelectedDate(toLocalIsoDate(appointment.starts_at));
    setSelectedTime(toLocalTimeValue(appointment.starts_at));
  }, [appointment]);

  async function handleConfirmChanges() {
    setFormError(null);

    if (!appointmentId) {
      setFormError("Missing appointment.");
      return;
    }

    if (!selectedDate) {
      setFormError("Please select a date.");
      return;
    }

    if (!selectedTime) {
      setFormError("Please select a time.");
      return;
    }

    if (!isChecked) {
      setFormError("Please confirm the appointment notice.");
      return;
    }

    try {
      const startsAt = buildLocalIsoDateTime(selectedDate, selectedTime);

      const endsAt = new Date(
        new Date(startsAt).getTime() + 30 * 60 * 1000
      ).toISOString();

      await update({
        id: String(appointmentId),
        startsAt,
        endsAt,
      });

      setShowSuccessOverlay(true);
    } catch (err) {
      console.error("[EditAppointment] update failed:", err);
    }
  }

  const visibleError = formError ?? appointmentError ?? updateError;

  return (
    <View style={styles.page}>
      <ScreenHeader title="Modify appointment" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthContainer}>
          <Text style={styles.sectionTitle}>Select date</Text>

          <View style={styles.month}>
            <Text style={styles.monthText}>
              Date selected
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={18} />
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <WeeklyCalendar
            selectedDate={selectedDate || undefined}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setFormError(null);
            }}
          />
        </View>

        <View style={styles.hoursContainer}>
          <HoursBooking
            selectedTime={selectedTime || undefined}
            onSelectTime={(time) => {
              setSelectedTime(time);
              setFormError(null);
            }}
          />
        </View>

        {loading ? (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Loading appointment...</Text>
          </View>
        ) : null}

        {visibleError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{visibleError}</Text>
          </View>
        ) : null}

        <View style={styles.noticeRow}>
          <Checkbox
            style={{ marginRight: 20 }}
            value={isChecked}
            onValueChange={(value) => {
              setChecked(value);
              setFormError(null);
            }}
          />

          <Text style={styles.noticeText}>
            By modifying this appointment, I am confirming my presence at that
            day and hour. I am aware that by failing to attend, or not notifying
            my unavailability may result in getting blacklisted.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={updating}
          onPress={handleConfirmChanges}
          style={[styles.containerButton, updating ? styles.disabledButton : null]}
        >
          <Text style={styles.buttonText}>
            {updating ? "Saving..." : "Confirm changes"}
          </Text>
        </Pressable>
      </ScrollView>

      <BookingSuccessOverlay
        visible={showSuccessOverlay}
        onAddToCalendar={() => {}}
        onGoHome={() => {
          setShowSuccessOverlay(false);
          router.replace("/appointments");
        }}
        onClose={() => setShowSuccessOverlay(false)}
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
    paddingTop: 26,
    paddingBottom: 120,
  },

  sectionTitle: {
    fontSize: 22,
    color: "#000",
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

  monthText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },

  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  calendarContainer: {
    marginBottom: 26,
  },

  hoursContainer: {
    marginBottom: 22,
  },

  statusContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#E8F4FA",
    padding: 12,
  },

  statusText: {
    color: "#333",
    fontSize: 14,
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

  noticeRow: {
    flexDirection: "row",
    maxWidth: 350,
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
  },

  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    maxWidth: 300,
    color: "#333",
  },

  containerButton: {
    width: "96%",
    backgroundColor: "#5085A8",
    height: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 14,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});