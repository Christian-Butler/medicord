import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type familyHistoryItem = {
    name: string;
    diagnosis: string;
    members: string[];
}

type personalHistoryItem = {
    name: string;
    diagnosisDate: string;
    conditionState: string;
}

{/* Use of generic parameter to help convert the stringifiedJSON value for use,
    otherwise it doesn't return the type I want of the data*/}
const parseStoredList = <Type,>(value?: string | string[]): Type[] => {
    if (!value) return [];

    const raw = Array.isArray(value) ? value[0] : value;

    try {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) return parsed as Type[];
        if (parsed) return [parsed as Type];
        return [];
    } catch {
        return [];
    }
};

export default function MedicalHistory() {
    const params = useLocalSearchParams<{
        addedFamilyHistory?: string,
        previousFamilyHistory?: string;
        addedPersonalHistory?: string;
        previousPersonalHistory?: string;
    }>();

    const [familyHistory, setFamilyHistory] = useState<familyHistoryItem[]>([]);
    const [personalHistory, setPersonalHistory] = useState<personalHistoryItem[]>([]);

    useEffect(() => {
        {/* Reads newly added family history item,
            adds it to previous list */ }
        if (params.addedFamilyHistory) {
            const previous = parseStoredList<familyHistoryItem>(params.previousFamilyHistory);
            try {
                const newItem = JSON.parse(params.addedFamilyHistory) as familyHistoryItem;
                setFamilyHistory([...previous, newItem]);
            } catch {

            }
        }
        {/* Reads newly added personal history item,
            adds it to previous list*/ }
        if (params.addedPersonalHistory) {
            const previous = parseStoredList<personalHistoryItem>(params.previousPersonalHistory);
            try {
                const newItem = JSON.parse(params.addedPersonalHistory) as personalHistoryItem;
                setPersonalHistory([...previous, newItem]);
            } catch {

            }
        }
    }, [
        params.addedFamilyHistory,
        params.previousFamilyHistory,
        params.addedPersonalHistory,
        params.previousPersonalHistory,
    ]);

    {/* Removes family or personal item from list*/ }
    const handleRemoveHistory = (
        type: "family" | "personal",
        indexToRemove: number
    ) => {
        if (type === "family") {
            setFamilyHistory((prev) =>
                prev.filter((_, index) => index !== indexToRemove)
            );
        } else {
            setPersonalHistory((prev) =>
                prev.filter((_, index) => index !== indexToRemove)
            );
        }
    };

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-6">
                <View className="pl-8 pr-8 pt-12 ">
                    <Text className="text-2xl text-center">Any medical history concerning the family ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">Indicating medical family history may help you in detecting the appearance of various health conditions such as diabetes, asthma or a cancer.</Text>
                </View>
                <View className="flex-1 pt-12" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: {
                                category: "family_medical_history",
                                previousFamilyHistory: JSON.stringify(familyHistory),
                            },
                        })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="font-medium text-center text-[#fff] font-medium">Add family medical history</Text>

                    </TouchableOpacity>
                </View>
                {/* <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-medium text-center text-[#5085A8] font-medium">My family has no medical history</Text>

                    </TouchableOpacity>
                </View>
                */}

                {familyHistory.length > 0 && (
                    <View className="mt-8">
                        {familyHistory.map((item, index) => (
                            <View
                                key={`${item.name}-${index}`}
                                className="px-4 py-6 mb-4 flex-row items-center justify-between rounded-2xl border-2 border-[#326F95]"
                            >
                                <MaterialIcons name="people" size={44} color="#0D5175" />
                                <View className="flex-1 px-4">
                                    <Text className="font-medium text-xl">{item.name}</Text>
                                    <Text className="text-base font-regular text-black mt-1">
                                        Members affected: {item.members.join(", ")}
                                    </Text>
                                    {item.diagnosis ? (
                                        <Text className="text-base font-regular text-black">
                                            Diagnosed at: {item.diagnosis || "Not stated"}
                                        </Text>
                                    ) : null}
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveHistory("family", index)}>
                                    <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <View className="mt-16 h-0.5 bg-[#BEC9CA] rounded-full" />
                <View className="pl-4 pr-4 pt-16">
                    <Text className="text-2xl text-center">Any personal medical history ?</Text>
                </View>

                <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: {
                                category: "personal_medical_history",
                                previousPersonalHistory: JSON.stringify(personalHistory),
                            },
                        })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-medium text-center text-[#fff] font-medium">Add personal medical history</Text>

                    </TouchableOpacity>
                </View>

                {personalHistory.length > 0 && (
                    <View className="mt-8">
                        {personalHistory.map((item, index) => (
                            <View
                                key={`${item.name}-${index}`}
                                className="px-4 py-6 mb-4 flex-row items-center justify-between rounded-2xl border-2 border-[#326F95]"
                            >
                                <MaterialIcons name="medical-information" size={44} color="#0D5175" />
                                <View className="flex-1 px-4">
                                    <Text className="font-medium text-xl">{item.name}</Text>

                                    {item.diagnosisDate ? (
                                        <Text className="text-base text-black mt-1">
                                            Diagnosed on: {item.diagnosisDate || "Not stated"}
                                        </Text>
                                    ) : null}

                                    {item.conditionState ? (
                                        <Text className="text-base text-black">
                                            Current state: {item.conditionState}
                                        </Text>
                                    ) : null}
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleRemoveHistory("personal", index)}
                                    className="mr-4"
                                >
                                    <MaterialIcons name="delete-outline" size={28} color="#D9534F"
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

            </View>

        </ScrollView>

    );
}
