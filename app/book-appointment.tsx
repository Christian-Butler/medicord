import WeeklyCalendar from "@/components/calendar";
import HoursBooking from "@/components/hours-select";
import BookingSuccessOverlay from "@/components/success-booking";
import ScreenHeader from "@/components/screen-header";
import { useCreateAppointment } from "@/src/hooks/useCreateAppointment";
import { useDoctor } from "@/src/hooks/useDoctor";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
    buildLocalIsoDateTime,
    getMonthLabel,
} from "@/src/utils/dateTime";




export default function Booking() {
    const { doctorId, specialty } = useLocalSearchParams<{
        doctorId?: string;
        name?: string;
        specialty?: string;
        closestDay?: string;
    }>();

    const {
        doctor,
        loading: doctorLoading,
        error: doctorError,
    } = useDoctor(doctorId ? String(doctorId) : undefined);

    const { create, creating, createError } = useCreateAppointment();

    const [isChecked, setChecked] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    async function handleConfirmBooking() {
        if (!doctor && !doctorId) {
            setFormError("Missing selected doctor.");
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

            console.log("[BookAppointment] created appointment:", created);

            setShowSuccessOverlay(true);
        } catch (err) {
            console.error("[BookAppointment] create appointment failed:", err);
        }
    }

    const visibleError = formError ?? doctorError ?? createError;

    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScreenHeader title="Appointment" />
            <ScrollView>
                <View className="flex-1" style={{ height: 26 }} />

                <View style={styles.monthContainer}>
                    <Text style={{ fontSize: 22 }}>Select date</Text>

                    <View style={styles.month}>
                        <Text>Month selected: {getMonthLabel(selectedDate)}</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={18} />
                    </View>
                </View>

                <View style={{ marginBottom: 26 }}>
                    <WeeklyCalendar
                        selectedDate={selectedDate ?? undefined}
                        onSelectDate={(date) => {
                            setSelectedDate(date);
                            setFormError(null);
                        }}
                    />
                </View>

                <View>
                    <HoursBooking
                        selectedTime={selectedTime ?? undefined}
                        onSelectTime={(time) => {
                            setSelectedTime(time);
                            setFormError(null);
                        }}
                    />
                </View>

                {doctorLoading ? (
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>Loading doctor...</Text>
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
                        By booking this appointment, I am confirming my presence at that day
                        and hour. I am aware that by failing to attend, or not notifying my
                        unavailability may result in getting blacklisted.
                    </Text>
                </View>

                <View
                    style={[
                        styles.containerButton,
                        creating ? styles.disabledButton : null,
                    ]}
                >
                    <Pressable
                        accessibilityRole="button"
                        disabled={creating}
                        onPress={handleConfirmBooking}
                    >
                        <Text style={styles.buttonText}>
                            {creating ? "Booking..." : "Confirm booking"}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            <BookingSuccessOverlay
                visible={showSuccessOverlay}
                onAddToCalendar={() => { }}
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

    monthContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: 26,
    },

    containerButton: {
        width: "96%",
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
        opacity: 0.6,
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