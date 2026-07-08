import WeeklyCalendar from "@/components/calendar";
import HoursBooking from "@/components/hours-select";
import UpdateAppointmentSuccessOverlay from "@/components/updated-booking-overlay";
import { useAppointment } from "@/src/hooks/useAppointment";
import { useUpdateAppointment } from "@/src/hooks/useUpdateAppointment";
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
import {
    buildLocalIsoDateTime,
    toLocalIsoDate,
    toLocalTimeValue,
} from "@/src/utils/dateTime";
import ScreenHeader from "@/components/screen-header";

function getMonthLabel(dateValue: string) {
    const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();

    return date.toLocaleDateString("en-GB", {
        month: "long",
    });
}

export default function EditAppointment() {
    const { appointmentId } = useLocalSearchParams<{
        appointmentId?: string;
    }>();
    const [showUpdateSuccessOverlay, setShowUpdateSuccessOverlay] = useState(false);

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

    useEffect(() => {
        if (!appointment) return;

        const localDate = toLocalIsoDate(appointment.starts_at);
        const localTime = toLocalTimeValue(appointment.starts_at);

        console.log("[editAppointment] loaded appointment:", appointment);
        console.log("[editAppointment] local selectedDate:", localDate);
        console.log("[editAppointment] local selectedTime:", localTime);

        setSelectedDate(localDate);
        setSelectedTime(localTime);
    }, [appointment]);

    async function handleConfirmChanges() {
        if (!appointment) {
            setFormError("Appointment not loaded.");
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

            const payload = {
                id: appointment.id,
                startsAt,
                endsAt,
                location: appointment.location,
                reason: appointment.reason ?? undefined,
                patientName: appointment.patient_name ?? undefined,
                patientEmail: appointment.patient_email ?? undefined,
                patientPhone: appointment.patient_phone ?? undefined,
            };

            console.log("[editAppointment] update payload:", payload);

            const updatedAppointment = await update(payload);
            await update(payload);
            setShowUpdateSuccessOverlay(true);

            console.log("[editAppointment] update successful:", updatedAppointment);


        } catch (err) {
            console.error("[editAppointment] update failed:", err);
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
                {loading ? (
                    <Text style={styles.statusText}>Loading appointment...</Text>
                ) : null}

                {visibleError ? (
                    <Text style={styles.errorText}>{visibleError}</Text>
                ) : null}

                <View style={styles.dateHeaderRow}>
                    <Text style={styles.sectionTitle}>Select date</Text>

                    <Pressable style={styles.monthPill}>
                        <Text style={styles.monthPillText}>
                            Month selected: {getMonthLabel(selectedDate)}
                        </Text>

                        <MaterialIcons name="keyboard-arrow-down" size={18} color="#000" />
                    </Pressable>
                </View>

                <View style={styles.calendarWrap}>
                    <WeeklyCalendar
                        selectedDate={selectedDate || undefined}
                        onSelectDate={setSelectedDate}
                    />
                </View>

                <View style={styles.hoursWrap}>
                    <HoursBooking
                        selectedTime={selectedTime || undefined}
                        onSelectTime={setSelectedTime}
                    />
                </View>

                <View style={styles.noticeRow}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? "#0D5175" : undefined}
                    />

                    <Text style={styles.noticeText}>
                        By confirming the changes, I am agreeing to be present at the day at
                        time indicated to the appointment.
                    </Text>
                </View>

                <Pressable
                    accessibilityRole="button"
                    style={[
                        styles.confirmButton,
                        updating ? styles.disabledButton : null,
                    ]}
                    onPress={handleConfirmChanges}
                    disabled={updating}
                >
                    <Text style={styles.confirmButtonText}>
                        {updating ? "Saving..." : "Confirm changes"}
                    </Text>
                </Pressable>
            </ScrollView>
            <UpdateAppointmentSuccessOverlay
                visible={showUpdateSuccessOverlay}
                onClose={() => setShowUpdateSuccessOverlay(false)}
                onViewAppointments={() => {
                    setShowUpdateSuccessOverlay(false);
                    router.replace("/appointments");
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
        paddingTop: 34,
        paddingBottom: 44,
    },

    statusText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 14,
        paddingHorizontal: 22,
    },

    errorText: {
        fontSize: 14,
        color: "#B42318",
        marginBottom: 14,
        paddingHorizontal: 22,
    },

    dateHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%",
        alignSelf: "center",
        marginBottom: 26,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "400",
        color: "#000",
    },

    monthPill: {
        height: 34,
        borderWidth: 2,
        borderColor: "#0D5175",
        borderRadius: 14,
        backgroundColor: "#fff",
        paddingLeft: 12,
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    monthPillText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#000",
        marginRight: 4,
    },

    calendarWrap: {
        marginBottom: 34,
    },

    hoursWrap: {
        marginBottom: 38,
    },

    noticeRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "90%",
        alignSelf: "center",
        marginBottom: 42,
    },

    checkbox: {
        width: 24,
        height: 24,
        marginTop: 4,
        marginRight: 14,
        borderRadius: 3,
    },

    noticeText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: "#000",
    },

    confirmButton: {
        height: 62,
        width: "96%",
        alignSelf: "center",
        backgroundColor: "#5085A8",
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    disabledButton: {
        opacity: 0.6,
    },

    confirmButtonText: {
        fontSize: 20,
        fontWeight: "500",
        color: "#fff",
    },
});