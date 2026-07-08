import CancelAppointmentOverlay from "@/components/cancel-appointment-overlay";
import ScreenHeader from "@/components/screen-header";
import { useAppointmentList } from "@/src/hooks/useAppointmentList";
import { useCancelAppointment } from "@/src/hooks/useCancelAppointment";
import type { Appointment } from "@/src/types/appointmentTypes";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const fallbackAvatar =
    "https://images.pexels.com/photos/6129452/pexels-photo-6129452.jpeg";

function getOrdinal(day: number) {
    if (day > 3 && day < 21) return `${day}th`;

    switch (day % 10) {
        case 1:
            return `${day}st`;
        case 2:
            return `${day}nd`;
        case 3:
            return `${day}rd`;
        default:
            return `${day}th`;
    }
}

function formatUpcomingDate(value: string) {
    const date = new Date(value);

    const weekday = date.toLocaleDateString("en-GB", {
        weekday: "short",
    });

    const month = date.toLocaleDateString("en-GB", {
        month: "long",
    });

    return `${weekday} ${month} ${getOrdinal(date.getDate())}`;
}

function formatPastDate(value: string) {
    const date = new Date(value);

    const month = date.toLocaleDateString("en-GB", {
        month: "long",
    });

    return `${getOrdinal(date.getDate())} ${month}`;
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AppointmentsPage() {
    const [selectedAppointmentToCancel, setSelectedAppointmentToCancel] =
        useState<Appointment | null>(null);

    const {
        upcomingAppointments,
        pastAppointments,
        loading,
        error,
        refetch,
    } = useAppointmentList();

    const { cancelById, cancelling, cancelError } =
        useCancelAppointment(refetch);

    function openCancelOverlay(appointment: Appointment) {
        console.log("[appointmentsPage] selected appointment to cancel:", appointment);
        setSelectedAppointmentToCancel(appointment);
    }

    function closeCancelOverlay() {
        if (cancelling) return;
        setSelectedAppointmentToCancel(null);
    }

    function handlePostponeAppointment() {
        if (!selectedAppointmentToCancel) return;

        const appointmentId = selectedAppointmentToCancel.id;

        setSelectedAppointmentToCancel(null);

        router.push({
            pathname: "/edit-appointment" as never,
            params: {
                appointmentId,
            },
        });
    }

    async function handleCancelAppointment() {
        if (!selectedAppointmentToCancel) return;

        try {
            await cancelById(selectedAppointmentToCancel.id);
            setSelectedAppointmentToCancel(null);
        } catch (err) {
            console.error("[appointmentsPage] cancel failed:", err);
        }
    }

    return (
        <View style={styles.page}>
            <ScreenHeader
                title="Appointments"
                onBackPress={() => router.push("/(tabs)")}
            />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <Text style={styles.statusText}>Loading appointments...</Text>
                ) : null}

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {cancelError ? (
                    <Text style={styles.errorText}>{cancelError}</Text>
                ) : null}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming</Text>
                </View>

                {upcomingAppointments.length === 0 && !loading ? (
                    <Text style={styles.emptyText}>No upcoming appointments.</Text>
                ) : null}

                {upcomingAppointments.map((appointment) => (
                    <AppointmentRow
                        key={appointment.id}
                        appointment={appointment}
                        type="upcoming"
                        onViewDetails={() =>
                            router.push({
                                pathname: "/appointment-details" as never,
                                params: {
                                    appointmentId: appointment.id,
                                },
                            })
                        }
                        onModify={() =>
                            router.push({
                                pathname: "/edit-appointment" as never,
                                params: {
                                    appointmentId: appointment.id,
                                },
                            })
                        }
                        onCancel={() => openCancelOverlay(appointment)}
                    />
                ))}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Past</Text>
                </View>

                {pastAppointments.length === 0 && !loading ? (
                    <Text style={styles.emptyText}>No past appointments.</Text>
                ) : null}

                {pastAppointments.map((appointment) => (
                    <AppointmentRow
                        key={appointment.id}
                        appointment={appointment}
                        type="past"
                        onViewDetails={() =>
                            router.push({
                                pathname: "/appointment-details" as never,
                                params: {
                                    appointmentId: appointment.id,
                                },
                            })
                        }
                    />
                ))}
            </ScrollView>

            <CancelAppointmentOverlay
                visible={!!selectedAppointmentToCancel}
                cancelling={cancelling}
                onClose={closeCancelOverlay}
                onPostpone={handlePostponeAppointment}
                onCancelAppointment={handleCancelAppointment}
            />
        </View>
    );
}

type AppointmentRowProps = {
    appointment: Appointment;
    type: "upcoming" | "past";
    onViewDetails: () => void;
    onModify?: () => void;
    onCancel?: () => void;
};

function AppointmentRow({
    appointment,
    type,
    onViewDetails,
    onModify,
    onCancel,
}: AppointmentRowProps) {
    const doctor = appointment.doctors;

    const doctorName = doctor?.full_name ?? "Unknown doctor";
    const doctorSpecialty = doctor?.specialty ?? "Specialist";
    const avatar = doctor?.avatar_url ?? fallbackAvatar;

    const location =
        appointment.location ??
        doctor?.location ??
        doctor?.clinic_name ??
        "Location unavailable";

    const dateText =
        type === "upcoming"
            ? formatUpcomingDate(appointment.starts_at)
            : formatPastDate(appointment.starts_at);

    const timeText = formatTime(appointment.starts_at);

    return (
        <View style={styles.appointmentRow}>
            <Image source={{ uri: avatar }} style={styles.avatar} />

            <View style={styles.appointmentContent}>
                <View style={styles.topLine}>
                    <View style={styles.doctorTextBlock}>
                        <Text style={styles.doctorName}>{doctorName}</Text>
                        <Text style={styles.specialty}>{doctorSpecialty}</Text>
                    </View>

                    <Pressable onPress={onViewDetails}>
                        <Text style={styles.viewDetails}>View details</Text>
                    </Pressable>
                </View>

                <Text style={styles.dateText}>
                    {dateText}, at {timeText}
                </Text>

                <Text style={styles.locationText}>{location}</Text>

                <View style={styles.actionRow}>
                    {type === "upcoming" ? (
                        <>
                            <Pressable style={styles.outlineButton}>
                                <Text style={styles.outlineButtonText}>Add to Calendar</Text>
                            </Pressable>

                            <View style={styles.rightActionColumn}>
                                <Pressable style={styles.modifyButton} onPress={onModify}>
                                    <Text style={styles.modifyButtonText}>Modify</Text>
                                </Pressable>

                                <Pressable style={styles.cancelButton} onPress={onCancel}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <View style={styles.prescriptionWrap}>
                            <Pressable style={styles.outlineButton}>
                                <Text style={styles.outlineButtonText}>Prescription</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
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
        paddingBottom: 70,
        borderBottomWidth: 4,
        borderBottomColor: "#0D5175",
    },

    statusText: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 14,
        color: "#333",
    },

    errorText: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 14,
        color: "#B42318",
    },

    emptyText: {
        paddingHorizontal: 8,
        paddingVertical: 18,
        fontSize: 16,
        color: "#555",
    },

    sectionHeader: {
        height: 72,
        justifyContent: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#C4D0D3",
        paddingHorizontal: 8,
    },

    sectionTitle: {
        fontSize: 26,
        fontWeight: "400",
        color: "#000",
    },

    appointmentRow: {
        flexDirection: "row",
        paddingTop: 34,
        paddingBottom: 38,
        paddingHorizontal: 8,
        borderBottomWidth: 2,
        borderBottomColor: "#C4D0D3",
    },

    avatar: {
        width: 66,
        height: 66,
        borderRadius: 33,
        marginTop: 26,
        marginRight: 14,
    },

    appointmentContent: {
        flex: 1,
        minWidth: 0,
    },

    topLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    doctorTextBlock: {
        flex: 1,
        paddingRight: 8,
    },

    doctorName: {
        fontSize: 22,
        fontWeight: "500",
        color: "#000",
        lineHeight: 26,
    },

    specialty: {
        fontSize: 20,
        fontWeight: "400",
        color: "#000",
        lineHeight: 24,
    },

    viewDetails: {
        fontSize: 16,
        fontWeight: "400",
        color: "#0D5175",
        marginTop: 6,
    },

    dateText: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: "500",
        color: "#000",
        lineHeight: 23,
    },

    locationText: {
        fontSize: 18,
        fontWeight: "400",
        color: "#000",
        lineHeight: 23,
        maxWidth: 260,
    },

    actionRow: {
        marginTop: 24,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
    },

    outlineButton: {
        minWidth: 0,
        height: 46,
        borderWidth: 2,
        borderColor: "#0D5175",
        borderRadius: 10,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 14,
    },

    outlineButtonText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#0D5175",
    },

    rightActionColumn: {
        alignItems: "flex-end",
        gap: 10,
    },

    modifyButton: {
        width: 106,
        height: 48,
        borderRadius: 10,
        backgroundColor: "#5085A8",
        alignItems: "center",
        justifyContent: "center",
    },

    modifyButtonText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#fff",
    },

    cancelButton: {
        width: 106,
        height: 42,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#0D5175",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    cancelButtonText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#0D5175",
    },

    prescriptionWrap: {
        flex: 1,
        alignItems: "flex-end",
    },
});