import ScreenHeader from "@/components/screen-header";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const familyMembers = [
    'Mother', 'Father', 'Sister', 'Brother',
    'Maternal grand-mother', 'Maternal grand-father',
    'Paternal grand-mother', 'Paternal grand-father',
    'Daughter', 'Son', 'Aunt', 'Uncle',
    'Female cousin', 'Male cousin'
];

export default function FamilyMembersList() {

    const params = useLocalSearchParams<{
        item: string;
        diagnosis: string;
        previousFamilyHistory?: string;

    }>();

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const { create } = useCreateMedicalRecord();

    const selectMember = (member: string) => {
        setSelectedMembers((prev) =>
            prev.includes(member)
                ? prev.filter((m) => m !== member)
                : [...prev, member]
        );
    };

    const handleSubmit = async () => {
        try {
            await Promise.all(
                selectedMembers.map((member) => create({
                    category: "family_medical_history",
                    item: params.item,
                    familyDiagnosis: params.diagnosis,
                    familyMember: member,
                })
                )
            )
            router.push("/mr-history");
        } catch (error) {
            console.error("Failed to save family records", error);
        }
    };

    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScreenHeader title="" />
            <View className="flex-1 m-6">
                <Text className="text-xl font-medium text-center mb-6">Which family member does it concern ?</Text>
                <FlatList
                    data={familyMembers}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                        const isChecked = selectedMembers.includes(item);
                        return (
                            <TouchableOpacity
                                onPress={() => selectMember(item)}
                                className="flex-row py-3 items-center border-b border-[#BEC9CA]">


                                <MaterialIcons name={isChecked ? "check-box" : "check-box-outline-blank"}
                                    size={24}
                                    color="#5085A8"
                                />
                                <Text className="ml-3 text-base text-black">{item}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <View className="h-0.5 bg-[#09516D]" />
            <View className="bg-white pb-6">
                <View className="m-8">
                    <TouchableOpacity
                        className={`justify-center h-14 bg-[#5085A8] items-center rounded-2xl ${selectedMembers.length === 0 ? "bg-[#D6E0E0]" : "bg-[#5085A8]"
                            }`}
                        disabled={selectedMembers.length === 0}
                        onPress={handleSubmit}
                    >
                        <Text className="text-base font-medium text-white">Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};
