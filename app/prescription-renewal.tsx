import RenewModal, { type RenewModalValues } from "@/components/renew-modal";
import ScreenHeader from "@/components/screen-header";
import { usePrescriptions } from "@/src/hooks/usePrescription";
import { useRequestRenewal } from "@/src/hooks/useRequestRenewal";
import type { Prescription } from "@/src/types/prescriptionTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

function formatDate(value: string) {
    return new Date(value).toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
}

// Newest year first, prescriptions inside each year already newest first from the API.
function groupByYear(prescriptions: Prescription[]) {
    const groups: { year: number; items: Prescription[] }[] = [];

    for (const prescription of prescriptions) {
        const year = new Date(prescription.created_at).getFullYear();
        const group = groups.find((g) => g.year === year);

        if (group) group.items.push(prescription);
        else groups.push({ year, items: [prescription] });
    }

    return groups;
}

export default function PrescriptionRenewal() {

    const [selected, setSelected] = useState<Prescription | null>(null);

    const { t } = useTranslation();

    const { prescriptions, loading, refetch } = usePrescriptions();
    const { request, requesting, requestError } = useRequestRenewal(refetch);

    // Load on focus, then check again every 15 seconds so Waiting flips to Approved while the page is open.
    useFocusEffect(
        useCallback(() => {
            refetch().catch(() => { });

            const interval = setInterval(() => {
                refetch().catch(() => { });
            }, 15000);

            return () => clearInterval(interval);
        }, [refetch])
    );

    const groups = useMemo(() => groupByYear(prescriptions), [prescriptions]);

    const handleConfirm = async (values: RenewModalValues) => {
        if (!selected) return;

        try {
            await request({
                documentId: selected.id,
                doctorId: values.doctorId,
                reason: values.reason,
                periodStart: values.periodStart,
                periodEnd: values.periodEnd,
            });
            setSelected(null);
        } catch {
            // requestError is shown inside the modal
        }
    };

    const renderStatus = (prescription: Prescription) => {
        const status = prescription.latestRenewal?.status;

        if (status === "waiting") {
            return (
                <View className="justify-center px-6 py-3 bg-[#E0BB4D] items-center rounded-[12px]">
                    <Text className="font-medium text-[16px] color-black">
                        {t(`prescription-renewal.waiting`)}
                    </Text>
                </View>
            );
        }

        if (status === "approved") {
            return (
                <View className="justify-center px-6 py-3 bg-[#17A633] items-center rounded-[12px]">
                    <Text className="font-medium text-[16px] color-white">
                        {t(`prescription-renewal.approved`)}
                    </Text>
                </View>
            );
        }

        // No request yet, or the last one was declined, so it can be asked for again.
        return (
            <TouchableOpacity
                onPress={() => setSelected(prescription)}
                className="justify-center px-6 py-3 bg-[#5085A8] items-center rounded-[12px]"
                accessibilityRole="button"
            >
                <Text className="font-medium text-[16px] color-white">
                    {t(`prescription-renewal.ask`)}
                </Text>
            </TouchableOpacity>
        );
    };

    return (

        <View className="flex-1 bg-[#fff]">
            <ScreenHeader title={t(`prescription-renewal.title`)} />

            <RenewModal
                visible={selected !== null}
                loading={requesting}
                error={requestError}
                onConfirm={handleConfirm}
                onClose={() => setSelected(null)}
            />

            <ScrollView
                className="flex-1 bg-[#EEF9FB]"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="px-6 py-8">
                    <Text className="text-xl">{t(`prescription-renewal.privacy`)}</Text>
                </View>

                <View className="px-4">

                    {loading ? (
                        <ActivityIndicator color="#0D5175" />
                    ) : null}

                    {!loading && prescriptions.length === 0 ? (
                        <Text className="text-[#3C4D4D]">{t(`prescription-renewal.empty`)}</Text>
                    ) : null}

                    {groups.map((group, index) => (
                        <View key={group.year}>
                            <View className={`${index > 0 ? "pt-6 " : ""}justify-between flex-row items-center`}>
                                <Text>{group.year} </Text>
                                <View className="w-80 h-0.5 bg-[#BEC9CA] rounded-full" />
                            </View>

                            {group.items.map((prescription) => (
                                <View key={prescription.id} className="pt-6 flex-row items-center">
                                    <MaterialIcons name="assignment" size={44} color="#0D5175" />
                                    <View className="flex-1 px-4">
                                        <Text>{prescription.title}</Text>
                                        <View className="flex-row items-center flex-wrap pt-2">
                                            {prescription.doctors?.full_name ? (
                                                <>
                                                    <Text className="text-[#3C4D4D]">{prescription.doctors.full_name} </Text>
                                                    <MaterialIcons name="circle" size={6} color="#3C4D4D" />
                                                    <Text className="text-[#3C4D4D]"> </Text>
                                                </>
                                            ) : null}
                                            <Text className="text-[#3C4D4D]">{formatDate(prescription.created_at)}</Text>
                                        </View>
                                    </View>
                                    <View className="self-center">
                                        {renderStatus(prescription)}
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}

                </View>

            </ScrollView>

        </View>
    );
}