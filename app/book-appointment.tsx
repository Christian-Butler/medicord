import WeeklyCalendar from "@/components/calendar";
import HoursBooking from "@/components/hours-select";
import ScreenHeader from "@/components/screen-header";
import BookingSuccessOverlay from "@/components/success-booking";
import { Colors, Sizes } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { useAvailableDates } from "@/src/hooks/useAvailableDates";
import { useAvailableTimes } from "@/src/hooks/useAvailableTimes";
import { useCreateAppointment } from "@/src/hooks/useCreateAppointment";
import { useDoctor } from "@/src/hooks/useDoctor";
import { useAddAppointmentToCalendar } from "@/src/hooks/useaddAppointmentToCalendar";
import type { Appointment } from "@/src/types/appointmentTypes";
import {
    buildLocalIsoDateTime,
    formatAppointmentDate,
    getMonthLabel,
    pad
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


// Renders the booking flow, including availability selection, confirmation, and success actions.
export default function Booking() {
    const { doctorId, specialty, reason } = useLocalSearchParams<{
        doctorId?: string;
        specialty?: string;
        reason?: string;
    }>();

    const {
        doctor,
        loading: doctorLoading,
        error: doctorError,
    } = useDoctor(doctorId ? String(doctorId) : undefined);

    const { profile, profileError } = useAuth();
    const { create, creating, createError } = useCreateAppointment();
    const { addToCalendar } = useAddAppointmentToCalendar();
    const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

    const [isChecked, setChecked] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [calendarWeekStart, setCalendarWeekStart] = useState<string | null>(null);
    const { availableDates, error: availabilityDatesError, } = useAvailableDates(
        doctor?.id,
        calendarWeekStart,
    );

    // puts into split string YYYY-MM format the current date
    const [viewMonth, setViewMonth] = useState(() => {
        const date = new Date();
        if (date.getDay() === 0) {
            date.setDate(date.getDate() + 1);
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });

    // changes visible month and clears date or time selection from the previous month
    function changeMonth(delta: number) {
        const [year, month] = viewMonth.split("-").map(Number);
        const nextMonth = new Date(year, month - 1 + delta, 1);
        const nextMonthValue = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}`;

        setViewMonth(nextMonthValue);
        setSelectedDate(null);
        setSelectedTime(null);
        setFormError(null);
    }

    const {
        times: availableTimes,
        refetch: refetchTimes,
    } = useAvailableTimes(doctorId ? String(doctorId) : undefined, selectedDate);

    // validates the selected appointment details, creates the booking, and refreshes availability on failure.
    async function handleConfirmBooking() {
        const selectedReason = (Array.isArray(reason) ? reason.join(", ") : reason)?.trim();

        if (!selectedReason) {
            setFormError(t(`booking-reason.selectionRequired`));
            return;
        }

        if (!doctor && !doctorId) {
            setFormError(t(`book-appointment.missing`));
            return;
        }

        if (!profile) {
            setFormError(profileError ?? "Your profile information is unavailable. Please try again.");
            return;
        }

        if (!selectedDate) {
            setFormError(t(`book-appointment.selectDate`));
            return;
        }

        if (!selectedTime) {
            setFormError(t(`book-appointment.selectTime`));
            return;
        }

        if (!isChecked) {
            setFormError(t(`book-appointment.confirmNotice`));
            return;
        }

        try {
            setFormError(null);

            const startsAt = buildLocalIsoDateTime(selectedDate, selectedTime);
            const endsAt = new Date(
                new Date(startsAt).getTime() + (doctor?.slot_minutes ?? 30) * 60 * 1000
            ).toISOString();

            const input = {
                doctorId: doctor?.id ?? String(doctorId),
                gpId: null,
                referralRequired: doctor?.requires_gp_referral ?? false,
                reason: selectedReason,
                startsAt,
                endsAt,
                title: `Appointment for ${profile.full_name}`,
                notes: `email:${profile.email ?? ""}, phone:${profile.phone ?? ""}`,
                location: doctor?.location ?? null,
            };

            console.log("[BookAppointment] create appointment input:", input);

            const created = await create(input);
            setBookedAppointment(created);

            console.log("[BookAppointment] created appointment:", created);

            setShowSuccessOverlay(true);
        } catch (err) {
            console.error("[BookAppointment] create appointment failed:", err);
            setSelectedTime(null);
            refetchTimes();
        }
    }

    const visibleError = formError ?? doctorError ?? profileError ?? createError ?? availabilityDatesError;
    const selectedReason = (Array.isArray(reason) ? reason.join(", ") : reason)?.trim();
    const confirm = Boolean(selectedDate && selectedTime && isChecked && selectedReason);

    const { t } = useTranslation();

    return (
        <View className="flex-1"
            style={{ backgroundColor: Colors.bg1 }}>
            <ScreenHeader title={t(`book-appointment.appointment`)} />
            <ScrollView>
                <View className="flex-1" style={{ height: 26 }} />

                <View style={styles.monthContainer}>
                    <Text style={{ fontSize: Sizes.h3 }}>{t(`book-appointment.date`)}</Text>

                    <View style={styles.month}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => changeMonth(-1)}
                            hitSlop={8}
                        >
                            <MaterialIcons name="chevron-left" size={24} />
                        </Pressable>
                        <Text>
                            {t(`book-appointment.${getMonthLabel(`${viewMonth}-01`)}`)}{" "}
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

                <View style={{ marginBottom: Sizes.h2 }}>
                    <WeeklyCalendar
                        viewMonth={viewMonth}
                        workingDays={doctor?.working_days}
                        availableDates={availableDates}
                        onWeekChange={setCalendarWeekStart}
                        selectedDate={selectedDate ?? undefined}
                        onSelectDate={(date) => {
                            setSelectedDate(date);
                            setViewMonth(date.slice(0, 7));
                            setSelectedTime(null);
                            setFormError(null);
                        }}
                    />
                </View>

                <View>
                    <HoursBooking
                        selectedTime={selectedTime ?? undefined}
                        availableTimes={selectedDate ? availableTimes : undefined}
                        onSelectTime={(time) => {
                            setSelectedTime(time);
                            setFormError(null);
                        }}
                    />
                </View>

                {doctorLoading ? (
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>{t(`book-appointment.loading`)}</Text>
                    </View>
                ) : null}

                {visibleError ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{visibleError}</Text>
                    </View>
                ) : null}

                <View style={styles.noticeRow}>

                </View>

                <View style={styles.container}>
                    <View className="flex-row px-2 items-center">
                        <Checkbox
                            style={{ marginRight: 20 }}
                            value={isChecked}
                            onValueChange={(value) => {
                                setChecked(value);
                                setFormError(null);
                            }}
                        />

                        <Text style={styles.noticeText}>
                            {t(`book-appointment.notice`)}
                        </Text>
                    </View>
                    {selectedDate && selectedTime ? (
                        <View className="flex-row pt-6 px-6 justify-center items-center">
                            <View>
                                <Text className="font-regular text-[16px]">
                                    {t(`book-appointment.recap1`)} {formatAppointmentDate(selectedDate)}
                                </Text>
                            </View>
                            <Text className="font-regular text-[16px]">
                                {t(`book-appointment.recap2`)} {selectedTime}
                            </Text>
                        </View>
                    ) : null}
                    <View
                        style={[
                            styles.containerButton,
                            !confirm || creating ? styles.disabledButton : null,
                        ]}
                    >
                        <Pressable
                            accessibilityRole="button"
                            disabled={!confirm || creating}
                            onPress={handleConfirmBooking}
                        >
                            <Text style={styles.buttonText}>
                                {creating ? "Booking..." : t(`book-appointment.confirm`)}
                            </Text>
                        </Pressable>
                    </View>


                </View>
            </ScrollView>

            <BookingSuccessOverlay
                visible={showSuccessOverlay}
                onAddToCalendar={() => { if (bookedAppointment) addToCalendar(bookedAppointment); }}
                onGoHome={() => {
                    setShowSuccessOverlay(false);
                    router.replace("/(tabs)");
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    month: {
        marginTop: Sizes.p3,
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

    disabledMonthArrow: {
        opacity: 0.35,
    },

    monthContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: Sizes.width - 50,
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: Sizes.h4,
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.bg2,
        alignSelf: "center",
        padding: 20,
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    containerButton: {
        width: "90%",
        backgroundColor: Colors.primary,
        color: Colors.bg2,
        height: 50,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-evenly",
        marginTop: Sizes.h1,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: Sizes.sm,
    },

    disabledButton: {
        backgroundColor: Colors.textMuted,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.bg2,
    },

    statusContainer: {
        width: "90%",
        alignSelf: "center",
        marginBottom: Sizes.paragraph,
        borderRadius: Sizes.p3,
        backgroundColor: Colors.bg1,
        padding: Sizes.p3,
    },

    statusText: {
        color: Colors.text,
        fontSize: Sizes.sm,
    },

    errorContainer: {
        width: "90%",
        alignSelf: "center",
    },

    errorText: {
        color: Colors.delete,
        fontSize: Sizes.sm,
    },

    noticeRow: {
        flexDirection: "row",
        maxWidth: 350,
        justifyContent: "space-between",
        alignSelf: "center",
        alignItems: "center",
    },

    noticeText: {
        fontSize: Sizes.sm,
        lineHeight: Sizes.h4,
        fontWeight: "400",
        maxWidth: 300,
        color: Colors.text,
    },
});