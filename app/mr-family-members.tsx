import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const familyMembers = [
    'Mother', 'Father', 'Sister', 'Brother',
    'Maternal grand-mother', 'Maternal grand-father',
    'Paternal grand-mother', 'Paternal grand-father',
    'Daughter', 'Son', 'Aunt', 'Uncle',
    'Female cousin', 'Male cousin'
];

export default function FamilyMembersList() {

    const { t } = useTranslation();

    const { createMany, creating } = useCreateMedicalRecord();
    const params = useLocalSearchParams<{
        item: string;
        diagnosis: string;
    }>();

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const selectMember = (member: string) => {
        setSelectedMembers((prev) =>
            prev.includes(member)
                ? prev.filter((m) => m !== member)
                : [...prev, member]
        );
    };

    const handleSubmit = async () => {
        try {
            // one request for all selected relatives
            await createMany(
                selectedMembers.map((member) => ({
                    category: "family_medical_history",
                    item: params.item,
                    familyDiagnosis: params.diagnosis,
                    familyMember: member,
                }))
            );
            // back to the existing history screen instead of stacking a new one
            router.dismissTo("/mr-history");
        } catch (error) {
            console.error("Failed to save family records", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg1 }}>
            <ScreenHeader title="" />
            <View style={{ flex: 1, margin: Sizes.h4 }}>
                <Text style={{
                    fontSize: Sizes.h5,
                    fontWeight: "500",
                    textAlign: "center",
                    marginBottom: Sizes.h4, color: Colors.text
                }}>{t(`mr-family-members.query`)}</Text>
                <FlatList
                    data={familyMembers}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                        const isChecked = selectedMembers.includes(item);
                        return (
                            <TouchableOpacity
                                onPress={() => selectMember(item)}
                                style={{
                                    flexDirection: "row",
                                    paddingHorizontal: Sizes.p2,
                                    paddingVertical: Sizes.h5,
                                    alignItems: "center",
                                    backgroundColor: Colors.bg2,
                                    marginVertical: Sizes.p2,
                                    height: 60,
                                    borderRadius: Sizes.p3
                                }}>


                                <MaterialIcons name={isChecked ? "check-box" : "check-box-outline-blank"}
                                    size={24}
                                    color={Colors.secondary}
                                />
                                <Text style={{
                                    marginLeft: Sizes.p3,
                                    fontSize: Sizes.paragraph,
                                    color: Colors.text
                                }}>{t(`mr-family-members.${item}`)}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <View style={{ borderTopWidth: Buttons.w1, borderTopColor: Colors.secondary, backgroundColor: Colors.bg2, paddingBottom: Sizes.h4 }}>
                <View style={{ padding: Sizes.h2 }}>
                    <TouchableOpacity
                        style={{ justifyContent: "center", height: Buttons.height, backgroundColor: selectedMembers.length === 0 ? Colors.dark.icon : Colors.primary, alignItems: "center", borderRadius: Sizes.p3 }}
                        disabled={selectedMembers.length === 0 || creating}
                        onPress={handleSubmit}
                    >
                        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>{t(`mr-family-members.continue`)}</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};
