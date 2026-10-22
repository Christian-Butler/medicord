import WeeklyCalendar from "@/components/calendar";
import HoursBooking from "@/components/hours-select";
import ScreenHeader from "@/components/screen-header";
import BookingSuccessOverlay from "@/components/success-booking";
import { useAvailableTimes } from "@/src/hooks/useAvailableTimes";
import { useCreateAppointment } from "@/src/hooks/useCreateAppointment";
import { useAddAppointmentToCalendar } from "@/src/hooks/useaddAppointmentToCalendar";
import type { Appointment } from "@/src/types/appointmentTypes";
import { useDoctor } from "@/src/hooks/useDoctor";
import {
    buildLocalIsoDateTime,
    getMonthLabel,
} from "@/src/utils/dateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Booking() {
    const { doctorId, specialty, reason } = useLocalSearchParams<{
        doctorId?: string;
        name?: string;
        specialty?: string;
        closestDay?: string;
        reason?: string;
    }>();

    const {
        doctor,
        loading: doctorLoading,
        error: doctorError,
    } = useDoctor(doctorId ? String(doctorId) : undefined);

    const { create, creating, createError } = useCreateAppointment();
    const { addToCalendar } = useAddAppointmentToCalendar();
    const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

    const [isChecked, setChecked] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const {
        times: availableTimes,
        refetch: refetchTimes,
    } = useAvailableTimes(doctorId ? String(doctorId) : undefined, selectedDate);

    async function handleConfirmBooking() {
        if (!doctor && !doctorId) {
            setFormError(t(`book-appointment.missing`));
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
                new Date(startsAt).getTime() + 30 * 60 * 1000
            ).toISOString();

            const input = {
                doctorId: doctor?.id ?? String(doctorId),
                gpId: null,
                referralRequired: doctor?.requires_gp_referral ?? false,

                patientName: "Philip",
                patientEmail: "demo@medicord.test",
                patientPhone: "07123456789",

                reason: `${doctor?.specialty ?? specialty ?? "Appointment"
                    } consultation`,
                startsAt,
                endsAt,
                location: doctor?.location ?? null,
            };

            console.log("[BookAppointment] create appointment input:", input);

            const created = await create(input);
             setBookedAppointment(created);

            console.log("[BookAppointment] created appointment:", created);

            setShowSuccessOverlay(true);
        } catch (err) {
            console.error("[BookAppointment] create appointment failed:", err);
            // the slot may have just been taken: clear it and reload what's free
            setSelectedTime(null);
            refetchTimes();
        }
    }

    const visibleError = formError ?? doctorError ?? createError;
    const confirm = Boolean(selectedDate && selectedTime && isChecked);

    const { t } = useTranslation();

    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScreenHeader title={t(`book-appointment.appointment`)} />
            <ScrollView>
                <View className="flex-1" style={{ height: 26 }} />

                <View style={styles.monthContainer}>
                    <Text style={{ fontSize: 22 }}>{t(`book-appointment.date`)}</Text>

                    <View style={styles.month}>
                        <MaterialIcons name="chevron-left" size={24} />
                        <Text>{getMonthLabel(selectedDate)} 2026</Text>
                        <MaterialIcons name="chevron-right" size={24} />
                    </View>
                </View>

                <View style={{ marginBottom: 26 }}>
                    <WeeklyCalendar
                        selectedDate={selectedDate ?? undefined}
                        onSelectDate={(date) => {
                            setSelectedDate(date);
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
                    <View className="flex-row pt-6 px-6 justify-center items-center">
                        <View>
                            <Text className="font-regular text-[16px]">{t(`book-appointment.recap1`)}</Text>
                        </View>
                        <Text className="font-regular text-[16px]">{t(`book-appointment.recap2`)}</Text>
                    </View>
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
                onClose={() => setShowSuccessOverlay(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    month: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: "500",
        backgroundColor: "#fff",
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
    },
    monthContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: "#fff",
        alignSelf: "center",
        padding: 20,
        shadowColor: "#070b23",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    containerButton: {
        width: "90%",
        backgroundColor: "#5085A8",
        color: "#fff",
        height: 50,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-evenly",
        marginTop: 30,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 14,
    },

    disabledButton: {
        backgroundColor: "#A1A1A1",
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#fff",
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
});