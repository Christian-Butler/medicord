import DoctorHeader from "@/components/doctor-details-header";
import { getDoctorById } from "@/src/api/doctors/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Doctor = {
    id: string;
    full_name: string;
    specialty: string | null;
    bio?: string | null;
    clinic_name?: string | null;
    location?: string | null;
    avatar_url?: string | null;
    requires_gp_referral?: boolean | null;
};

export default function DoctorDetails() {
    const { doctorId, name, closestDay, specialty } = useLocalSearchParams<{
        doctorId?: string;
        name?: string;
        closestDay?: string;
        specialty?: string;
    }>();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDoctor() {
            if (!doctorId) {
                console.log("[DoctorDetails] no doctorId param");
                return;
            }

            try {
                setError(null);

                console.log("[DoctorDetails] loading doctorId:", doctorId);

                const row = await getDoctorById(String(doctorId));

                console.log("[DoctorDetails] doctor returned:", row);

                setDoctor(row as Doctor);
            } catch (err) {
                console.error("[DoctorDetails] failed to load doctor:", err);
                setError(err instanceof Error ? err.message : "Failed to load doctor");
            }
        }

        loadDoctor();
    }, [doctorId]);

    const doctorName = doctor?.full_name || name || "Dr. Eric Smith";
    const doctorProfession = doctor?.specialty || specialty || "Cardiologist";
    const availableDate = closestDay || "No slots available";

    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScrollView>
                <View className="flex-1">
                    <DoctorHeader name={doctorName} profession={doctorProfession} />
                </View>

                <View style={{ padding: 20, paddingBottom: 220 }}>
                    {error ? (
                        <Text style={{ color: "#B42318", paddingBottom: 12 }}>
                            {error}
                        </Text>
                    ) : null}

                    {/* Leave room for the sticky booking footer-like container. */}

                    <Text style={{ fontSize: 24, fontWeight: 400, paddingBottom: 20 }}>
                        Services provided
                    </Text>

                    <Text style={{ fontSize: 16, fontWeight: 400, lineHeight: 22 }}>
                        The cardiologist is a specialist in the heart and its pathologies as well as vascular problems.{"\n"}{"\n"}

                        <Text style={{ fontSize: 16, fontWeight: 400, lineHeight: 22 }}>
                            {doctorName} practices:{"\n"}{"\n"}
                        </Text>

                        <Text style={{ fontSize: 16, fontWeight: 400, lineHeight: 22 }}>
                            - in his private office the cardiological examination, echocardiography, holter, electrocardiogram, sleep apnea screening;{"\n"}
                            - and at the St. Vincent’s Hospital, the stress test is held only on Wednesday mornings (a prior consultation is necessary to carry out the stress tests in the clinic).{"\n"}{"\n"}
                        </Text>

                        <Text style={{ fontSize: 16, fontWeight: 400, lineHeight: 22 }}>
                            It is also possible to obtain more information for follow-up consultations and for new patients through its secretariat through the messages service provided in Medicord.
                        </Text>
                    </Text>
                </View>
            </ScrollView>

            {/* Keep the booking action visible above the screen's edge. */}

            <View style={styles.container}>
                <View>
                </View>

                <View style={styles.dayContainer}>
                    <Text>Closest available slot :</Text>
                    <Text style={styles.day}>{availableDate}</Text>
                </View>

                <Pressable
                    style={styles.containerButton}
                    accessibilityRole="button"
                    onPress={() =>
                        router.push({
                            pathname: "/book-appointment",
                            params: {
                                doctorId: doctor?.id ?? doctorId,
                                specialty: doctorProfession,
                                closestDay: availableDate,
                            },
                        })
                    }
                >
                    <Text style={styles.buttonText}>Book an appointment now</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerButton: {
        flexDirection: 'row',
        backgroundColor: '#5085A8',
        color: '#fff',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 30,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 14,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff'
    },
    container: {
        height: 180,
        backgroundColor: '#fff',
        padding: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: '#070b23',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    day: {
        fontSize: 12,
        fontWeight: '500',
        backgroundColor: '#fff',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 2,
        borderColor: '#0D5175',
        borderRadius: 14
    },
    dayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
});