import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Allergies() {
    const params = useLocalSearchParams<{ addedAllergy?: string }>();
    const { records, refetch } = useMedicalRecords("allergies");
    const { create } = useCreateMedicalRecord();
    const { deleteRecord } = useDeleteMedicalRecord(refetch);

    const { t } = useTranslation();

    useEffect(() => {
        if (params.addedAllergy) {
            const allergyToAdd = params.addedAllergy;
            router.setParams({ addedAllergy: undefined });

            create({
                category: "allergies",
                item: allergyToAdd,
                vaccineDate: null,
                operationDate: null,
                diagnosis: null,
                conditionState: null,
            })
                .then(() => refetch())
                .catch((err) => console.error("[Allergies] save failed:", err));
        }
    }, [params.addedAllergy]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>
            <ScreenHeader title='' />

            <View style={{ margin: Sizes.h4 }}>
                <View style={{ paddingHorizontal: Sizes.h2, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ fontSize: Sizes.h2, textAlign: "center", color: Colors.text }}>
                        {t(`mr-allergies.query`)}
                    </Text>
                </View>
                <View style={{ paddingHorizontal: Sizes.p2, paddingTop: Sizes.h5 }}>
                    <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.text }}>
                        {t(`mr-allergies.info`)}
                    </Text>
                </View>

                <View style={{ flex: 1, margin: Sizes.p2, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            backgroundColor: Colors.primary,
                            height: Buttons.height,
                            marginBottom: Sizes.h2,
                            alignItems: "center",
                            borderRadius: Sizes.p3,
                        }}
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "allergies" },
                        })}
                    >
                        <MaterialIcons name="add" size={26} color={Colors.bg2} />
                        <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.bg2, fontWeight: "500" }}>
                            {t(`mr-allergies.add`)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {records.length > 0 && (
                <View style={{ marginTop: Sizes.h1 + Sizes.h3 }}>
                    {records.map((record) => (
                        <View key={record.id} style={{
                            marginHorizontal: Sizes.h4,
                            marginBottom: Sizes.h2,
                            paddingHorizontal: Sizes.h4,
                            paddingVertical: Sizes.h2,
                            backgroundColor: Colors.bg2,
                            borderRadius: Sizes.p3 + Sizes.p1,
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}>

                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <MaterialIcons name="gpp-maybe" size={44} color={Colors.secondary} />

                                    <Text style={{
                                        paddingLeft: Sizes.h4,
                                        marginTop: Sizes.p2,
                                        fontWeight: "500",
                                        fontSize: Sizes.h5,
                                        marginBottom: Sizes.p2,
                                        color: Colors.text
                                    }}>
                                        {t(`mr-allergies.${record.item}`)}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                                    <MaterialIcons name="delete-outline" size={Sizes.h1} color={Colors.delete} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}