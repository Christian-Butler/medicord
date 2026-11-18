import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function MedicalHistory() {
       // both halves of the screen in one request
    const { records, refetch } = useMedicalRecords([
        "family_medical_history",
        "personal_medical_history",
    ]);
    const { deleteRecord } = useDeleteMedicalRecord(refetch);

    const familyRecords = records.filter((r) => r.category === "family_medical_history");
    const personalRecords = records.filter((r) => r.category === "personal_medical_history");

    const { t } = useTranslation();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>
            <ScreenHeader title='' />

            <View style={{ margin: Sizes.h4 }}>
                <View style={{ paddingHorizontal: Sizes.h2, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ fontSize: Sizes.h2, textAlign: "center", color: Colors.text }}>{t(`mr-history.query`)}</Text>
                </View>
                <View style={{ paddingHorizontal: Sizes.paragraph, paddingTop: Sizes.h5 }}>
                    <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.text }}>
                        {t(`mr-history.info`)}
                    </Text>
                </View>
                <View style={{ flex: 1, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: "row", justifyContent: "center", backgroundColor: Colors.primary, height: Buttons.height, alignItems: "center", borderRadius: Sizes.p3 + Sizes.p1 }}
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "family_medical_history" },
                        })}
                    >
                        <MaterialIcons name="add" size={26} color={Colors.bg2} />
                        <Text style={{ fontWeight: "500", textAlign: "center", color: Colors.bg2 }}>{t(`mr-history.addF`)}</Text>
                    </TouchableOpacity>
                </View>

                {familyRecords.length > 0 && (
                    <View style={{ marginTop: Sizes.p2 }}>
                        {familyRecords.map((record) => (
                            <View key={record.id} style={{ marginTop: Sizes.p2, paddingHorizontal: Sizes.h4, paddingVertical: Sizes.p2, backgroundColor: Colors.bg2, borderRadius: Sizes.p3 + Sizes.p1 }}>
                                <View style={{ marginVertical: Sizes.h4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialIcons name="medical-information" size={36} color={Colors.secondary} />
                                        <View style={{ marginLeft: Sizes.h4 }}>
                                            <Text style={{ fontWeight: "500", fontSize: Sizes.h5, marginBottom: Sizes.p1, color: Colors.text }}>{t(`mr-history.${record.item}`)}</Text>
                                            {record.family_diagnosis ? (
                                                <View style={{ maxWidth: 240, flexDirection: "row", marginBottom: Sizes.p1 }}>
                                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-history.diagnosed`)}</Text>
                                                    <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{record.family_diagnosis} {t(`mr-history.years`)}</Text>
                                                </View>
                                            ) : null}
                                            {record.family_member ? (
                                                <View style={{ flexDirection: "row", maxWidth: 240 }}>
                                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-history.relationship`)} </Text>
                                                    <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{record.family_member}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                                        <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={{ marginTop: Sizes.h1 + Sizes.h3, height: 1, backgroundColor: Colors.dark.icon, borderRadius: Sizes.p0 }} />

                <View style={{ paddingHorizontal: Sizes.paragraph, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ fontSize: Sizes.h2, textAlign: "center", color: Colors.text }}>{t(`mr-history.query2`)}</Text>
                </View>
                <View style={{ flex: 1, paddingTop: Sizes.h2 }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: "row", justifyContent: "center", backgroundColor: Colors.primary, height: Buttons.height, alignItems: "center", borderRadius: Sizes.p3 + Sizes.p1 }}
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "personal_medical_history" },
                        })}
                    >
                        <MaterialIcons name="add" size={26} color={Colors.bg2} />
                        <Text style={{ textAlign: "center", color: Colors.bg2, fontWeight: "500" }}>{t(`mr-history.addP`)}</Text>
                    </TouchableOpacity>
                </View>

                {personalRecords.length > 0 && (
                    <View style={{ marginTop: Sizes.p2, marginBottom: Sizes.h1 }}>
                        {personalRecords.map((record) => (
                            <View key={record.id} style={{ marginTop: Sizes.p2, paddingHorizontal: Sizes.h4, paddingVertical: Sizes.p2, backgroundColor: Colors.bg2, borderRadius: Sizes.p3 + Sizes.p1 }}>
                                <View style={{ marginVertical: Sizes.h4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialIcons name="medical-information" size={36} color={Colors.secondary} />
                                        <View style={{ marginLeft: Sizes.h4 }}>
                                            <Text style={{ fontWeight: "500", fontSize: Sizes.h5, marginBottom: Sizes.p1, color: Colors.text }}>{t(`mr-history.${record.item}`)}</Text>
                                            {record.diagnosis ? (
                                                <View style={{ flexDirection: "row", marginBottom: Sizes.p1 }}>
                                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-history.diagnosed2`)} </Text>
                                                    <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{record.diagnosis}</Text>
                                                </View>
                                            ) : null}
                                            {record.condition_state ? (
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-history.state`)} </Text>
                                                    <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{t(`mr-history.${record.condition_state}`)}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                                        <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}