import WeeklyCalendar from "@/components/calendar";
import HoursBooking from "@/components/hours-select";
import ScreenHeader from "@/components/screen-header";
import UpdateAppointmentSuccessOverlay from "@/components/updated-booking-overlay";
import { Colors, Sizes } from "@/constants/theme";
import { useAppointment } from "@/src/hooks/useAppointment";
import { useAvailableTimes } from "@/src/hooks/useAvailableTimes";
import { useAvailableDates } from "@/src/hooks/useAvailableDates";
import { useUpdateAppointment } from "@/src/hooks/useUpdateAppointment";
import { useAddAppointmentToCalendar } from "@/src/hooks/useaddAppointmentToCalendar";
import type { Appointment } from "@/src/types/appointmentTypes";
import {
  buildLocalIsoDateTime,
  getMonthLabel,
  toLocalIsoDate,
  toTimeValue,
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { addToCalendar } = useAddAppointmentToCalendar();
  const [updatedAppointment, setUpdatedAppointment] = useState<Appointment | null>(null);

  const { update, updating, updateError } = useUpdateAppointment();
  const [isChecked, setChecked] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [updateAppointmentOverlay, setUpdateAppointmentOverlay] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarWeekStart, setCalendarWeekStart] = useState<string | null>(null);
  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [viewMonth, setViewMonth] = useState(() => {
    const date = new Date();
    if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1);
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  function changeMonth(delta: number) {
    const [year, month] = viewMonth.split("-").map(Number);
    const nextMonth = new Date(year, month - 1 + delta, 1);
    const nextMonthValue = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;
    if (nextMonthValue < currentMonth) return;

    setViewMonth(nextMonthValue);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormError(null);
  }

  useEffect(() => {
    if (!appointment) return;

    setSelectedDate(toLocalIsoDate(appointment.starts_at));
    setSelectedTime(toTimeValue(appointment.starts_at));
  }, [appointment]);

  const {
    times: freeTimes,
    refetch: refetchTimes,
  } = useAvailableTimes(appointment?.doctor_id ?? undefined, selectedDate || null);
  const {
    availableDates,
    error: availabilityDatesError,
  } = useAvailableDates(
    appointment?.doctor_id ?? undefined,
    calendarWeekStart,
  );


  const originalDate = appointment ? toLocalIsoDate(appointment.starts_at) : null;
  const originalTime = appointment ? toTimeValue(appointment.starts_at) : null;
  const availableTimes =
    originalTime && selectedDate === originalDate && !freeTimes.includes(originalTime)
      ? [...freeTimes, originalTime].sort()
      : freeTimes;

  const { t } = useTranslation();

  async function handleConfirmChanges() {
    setFormError(null);

    if (!appointmentId) {
      setFormError(t(`edit-appointment.missing`));
      return;
    }

    if (!selectedDate) {
      setFormError(t(`edit-appointment.unselectedT`));
      return;
    }

    if (!selectedTime) {
      setFormError(t(`edit-appointment.unselectedT`));
      return;
    }

    if (!isChecked) {
      setFormError(t(`edit-appointment.confirmN`));
      return;
    }

    try {
      const startsAt = buildLocalIsoDateTime(selectedDate, selectedTime);

      const endsAt = new Date(
        new Date(startsAt).getTime() + (appointment?.doctors?.slot_minutes ?? 30) * 60 * 1000
      ).toISOString();

      const updated = await update({
        id: String(appointmentId),
        startsAt,
        endsAt,
      });
      setUpdatedAppointment(updated);
      setUpdateAppointmentOverlay(true);
    } catch (err) {
      console.error("[EditAppointment] update failed:", err);
      setSelectedTime("");
      refetchTimes();
    }
  }

  const visibleError =
    formError ?? appointmentError ?? updateError ?? availabilityDatesError;

  return (
    <View style={styles.page}>
      <ScreenHeader title={t(`edit-appointment.name`)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.monthContainer}>
          <Text style={{ fontSize: 22 }}>{t(`book-appointment.date`)}</Text>

          <View style={styles.month}>
            <Pressable
              accessibilityRole="button"
              disabled={viewMonth <= currentMonth}
              onPress={() => changeMonth(-1)}
              hitSlop={8}
              style={viewMonth <= currentMonth ? styles.disabledMonthArrow : undefined}
            >
              <MaterialIcons name="chevron-left" size={24} />
            </Pressable>
            <Text>
              {t(`edit-appointment.${getMonthLabel(`${viewMonth}-01`)}`)}{" "}
              {viewMonth.slice(0, 4)}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => changeMonth(1)}
              hitSlop={8}
            >
              <MaterialIcons name="chevron-right" size={24} />
            </Pressable>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <WeeklyCalendar
            viewMonth={viewMonth}
            workingDays={appointment?.doctors?.working_days}
            availableDates={availableDates}
            onWeekChange={setCalendarWeekStart}
            selectedDate={selectedDate ?? undefined}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setViewMonth(date.slice(0, 7));
              setSelectedTime("");
              setFormError(null);
            }}
          />
        </View>

        <View style={styles.hoursContainer}>
          <HoursBooking
            selectedTime={selectedTime || undefined}
            availableTimes={selectedDate ? availableTimes : undefined}
            onSelectTime={(time) => {
              setSelectedTime(time);
              setFormError(null);
            }}
          />
        </View>

        {loading ? (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{t(`edit-appointment.loading`)}</Text>
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
            {t(`edit-appointment.notice`)}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={updating}
          onPress={handleConfirmChanges}
          style={[styles.containerButton, updating ? styles.disabledButton : null]}
        >
          <Text style={styles.buttonText}>
            {updating ? t(`edit-appointment.saving`) : t(`edit-appointment.confirm`)}
          </Text>
        </Pressable>
      </ScrollView>

      <UpdateAppointmentSuccessOverlay
        visible={updateAppointmentOverlay}
        onAddToCalendar={() => { if (updatedAppointment) addToCalendar(updatedAppointment); }}
        onGoHome={() => {
          setUpdateAppointmentOverlay(false);
          router.replace("/(tabs)");
        }}
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
    marginTop: Sizes.p0,
    fontSize: Sizes.sm,
    fontWeight: "500",
    backgroundColor: Colors.bg2,
    paddingVertical: Sizes.p2,
    paddingHorizontal: Sizes.p1,
    width: Sizes.width - 230,
    borderRadius: Sizes.p3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  monthText: {
    fontSize: Sizes.sm,
    fontWeight: "500",
    color: Colors.text,
  },

  disabledMonthArrow: {
    opacity: 0.35,
  },

  monthContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: Sizes.width - 50,
    alignSelf: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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