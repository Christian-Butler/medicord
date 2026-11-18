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

export default function Operations() {
    const { records, refetch } = useMedicalRecords("operations");
    const { deleteRecord } = useDeleteMedicalRecord(refetch);

    const { t } = useTranslation();


    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>
            <ScreenHeader title='' />

            <View style={{ margin: Sizes.h4 }}>
                <View style={{ paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ fontSize: Sizes.h2, textAlign: "center", color: Colors.text }}>{t(`mr-operations.query`)}</Text>
                </View>
                <View style={{ paddingHorizontal: Sizes.paragraph, paddingTop: Sizes.h5 }}>
                    <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.text }}>
                        {t(`mr-operations.keepTrace`)}
                    </Text>
                </View>
                <View style={{ flex: 1, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            backgroundColor: Colors.primary,
                            height: Buttons.height,
                            alignItems: "center",
                            borderRadius: Sizes.p3
                        }}
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "operations" },
                        })}
                    >
                        <MaterialIcons name="add" size={Sizes.h2} color={Colors.bg2} />
                        <Text style={{
                            fontSize: Sizes.paragraph,
                            textAlign: "center",
                            color: Colors.bg2,
                            fontWeight: "500"
                        }}>{t(`mr-operations.add`)}</Text>
                    </TouchableOpacity>
                </View>

                {records.length > 0 && (
                    <View style={{ marginTop: Sizes.p2 }}>
                        {records.map((record) => (
                            <View key={record.id}
                                style={{
                                    marginTop: Sizes.p2,
                                    paddingHorizontal: Sizes.h4,
                                    paddingVertical: Sizes.h4,
                                    backgroundColor: Colors.bg2,
                                    borderRadius: Sizes.p3
                                }}>
                                <View style={{
                                    marginVertical: Sizes.h4,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <MaterialIcons name="local-hospital" size={Sizes.IconNml} color={Colors.secondary} />
                                        <View style={{ marginLeft: Sizes.h4 }}>
                                            <Text style={{ fontWeight: "500", fontSize: Sizes.h5, color: Colors.text }}>{t(`mr-operations.${record.item}`)}</Text>
                                            {record.operation_date ? (
                                                <Text style={{ fontSize: Sizes.sm, color: Colors.textMuted }}>{record.operation_date}</Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteRecord(record.id)}>
                                        <MaterialIcons name="delete-outline" size={Sizes.h1} color={Colors.delete} />
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