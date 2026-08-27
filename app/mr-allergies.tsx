import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Allergies() {
    const params = useLocalSearchParams<{ addedAllergy?: string, previousAllergies?: string[] | string }>();

    const [allergiesList, setAllergiesList] = useState<string[]>([]);

    useEffect(() => {
        const added = params.addedAllergy;
        if (!added) return;

        const rawPrev = params.previousAllergies;
        let previous: string[] = [];

        {/* For each navigation, previous list is made to come back with params rather than kept */ }
        if (Array.isArray(rawPrev)) {
            previous = rawPrev.map(String);
        } else if (typeof rawPrev === "string") {
            try {
                const parsed = JSON.parse(rawPrev);
                previous = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
            } catch {
                previous = rawPrev.split(",").map(s => s.trim()).filter(Boolean);
            }
        }

        {/* To not have dupes, it checks if the name matches*/ }
        setAllergiesList(() => previous.includes(added) ? previous : [...previous, added]);
    }, [params.addedAllergy, params.previousAllergies]);


    const handleRemoveAllergy = (removeAllergy: string) => {
        setAllergiesList((prev) => prev.filter((item) => item !== removeAllergy));
    }

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-6 pr-6 pt-12 ">
                    <Text className="text-2xl text-center">Do you have any allergy ?</Text>
                </View>
                <View className="pl-2 pr-2 pt-4">
                    <Text className="text-base text-center">Keep a trace of your allergies to improve medical follow-ups. It includes food, medication or anything else.</Text>
                </View>

                <View className="flex-1 m-2 mb-12 pt-12" >
                    <TouchableOpacity
                        className="flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "allergies", previousAllergies: JSON.stringify(allergiesList) },
                        })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">Add an allergy</Text>

                    </TouchableOpacity>
                </View>

                {/* 
                <View className="flex-1  m-2 pt-4" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I don't have an allergy</Text>

                    </TouchableOpacity>
                </View>

                */}

            </View>

            {/*   <View className="mx-4 mt-10 h-0.5 bg-[#BEC9CA] rounded-full" />*/}

            {allergiesList.length > 0 && (

                <View className="mt-20 mx-6 ">

                    {allergiesList.map((allergy) => (
                        <View
                            key={allergy}
                            className="px-2 py-8 mb-4 flex-row items-center justify-between rounded-2xl border-2 border-[#326F95]">
                            <View className="flex-row items-center">
                                <MaterialIcons name="gpp-maybe" size={44} color="#0D5175"
                                    className="mx-4" />
                                <View>
                                    <Text className="font-medium text-xl">
                                        {allergy}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="mr-4"
                                onPress={() => handleRemoveAllergy(allergy)}
                            >
                                <MaterialIcons name="delete-outline" size={28} color="#D9534F"
                                />
                            </TouchableOpacity>
                        </View>
                    ))}

                </View>
            )
            }
        </ScrollView >
    );
}