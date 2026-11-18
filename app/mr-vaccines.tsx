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

export default function Vaccines() {
    const { records, refetch } = useMedicalRecords("vaccines");
    const { deleteRecord } = useDeleteMedicalRecord(refetch);

    const { t } = useTranslation();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>
            <ScreenHeader title="" />

            <View style={{ margin: Sizes.h4 }}>
                <View style={{ paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ fontSize: Sizes.h2, textAlign: "center", color: Colors.text }}>{t(`mr-vaccines.query`)}</Text>
                </View>
                <View style={{ paddingTop: Sizes.h5 }}>
                    <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.text }}>
                        {t(`mr-vaccines.info`)}
                    </Text>
                </View>

                <View style={{ flex: 1, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: "row", justifyContent: "center", backgroundColor: Colors.primary, height: Buttons.height, alignItems: "center", borderRadius: Sizes.p3 + Sizes.p1, marginBottom: Sizes.h1 + Sizes.h3 }}
                        accessibilityRole="button"
                        onPress={() =>
                            router.push({
                                pathname: "/mr-search-history",
                                params: { category: "vaccines" },
                            })
                        }
                    >
                        <MaterialIcons name="add" size={Sizes.h2} color={Colors.bg2} />
                        <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.bg2, fontWeight: "500" }}>{t(`mr-vaccines.add`)}</Text>
                    </TouchableOpacity>
                </View>

                {/* 
                <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-[16px] text-center text-[#5085A8] font-medium">I have not received any vaccine</Text>

                    </TouchableOpacity>
                </View>
                */}
                {records.length > 0 && (
                    <View style={{ marginBottom: Sizes.h1 }}>
                        {records.map((record) => (
                            <View
                                key={record.id}
                                style={{ paddingHorizontal: Sizes.h4, paddingVertical: Sizes.h2, marginBottom: Sizes.p2, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: Sizes.p3 + Sizes.p1, backgroundColor: Colors.bg2 }}
                            >
                                <MaterialIcons name="vaccines" size={Sizes.IconLg} color={Colors.secondary} />
                                <View style={{ flex: 1, paddingHorizontal: Sizes.h4 }}>
                                    <Text style={{ fontWeight: "500", fontSize: Sizes.h5, marginBottom: Sizes.p1, color: Colors.text }}>{record.item}</Text>
                                    {record.vaccine_date ? (
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-vaccines.received`)}</Text>
                                            <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{record.vaccine_date} </Text>
                                        </View>
                                    ) : null}
                                </View>
                                <TouchableOpacity
                                    onPress={() => deleteRecord(record.id)}
                                    style={{ marginRight: Sizes.h4 }} >
                                    <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}