import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Vaccines = {
    name: string;
    date: string;
};

export default function Vaccines() {

    const params = useLocalSearchParams<{
        addedVaccine?: string;
        previousVaccines?: string | string[];
    }>();

    const [vaccines, setVaccines] = useState<Vaccines[]>([]);

    useEffect(() => {
        const added = params.addedVaccine;
        if (!added) return;

        const rawPrev = params.previousVaccines;
        let previous: Vaccines[] = [];

        if (typeof rawPrev === "string") {
            try {
                const parsed = JSON.parse(rawPrev);
                previous = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                previous = [];
            }
        } else if (Array.isArray(rawPrev)) {
            previous = rawPrev
                .map((item) => {
                    try {
                        return JSON.parse(item);
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean) as Vaccines[];
        }

        {/* To not have dupes, it checks if the name matches */ }
        try {
            const newVaccine = JSON.parse(added) as Vaccines;
            setVaccines(() => {
                const alreadyExists = previous.some((v) => v.name === newVaccine.name);
                return alreadyExists ? previous : [...previous, newVaccine];
            });
        } catch {
        }
    }, [params.addedVaccine, params.previousVaccines]);

    const handleRemoveVaccine = (indexToRemove: number) => {
        setVaccines((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <ScrollView className="bg-[#EEF9FB]">
            <ScreenHeader title="" />

            <View className="m-6">
                <View className="pl-8 pr-8 pt-12">
                    <Text className="text-2xl text-center">Have you received any vaccine ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">
                        With a vaccine history you can keep track of what you're protected from.
                    </Text>
                </View>

                <View className="flex-1 pt-12">
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() =>
                            router.push({
                                pathname: "/mr-search-history",
                                params: { category: "vaccines", previousVaccines: JSON.stringify(vaccines) },
                            })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">
                            Add a vaccine
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 
                <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I have not received any vaccine</Text>

                    </TouchableOpacity>
                </View>
                */}
            </View>{vaccines.length > 0 && (
                <View className="mt-10 mx-6 mb-10">
                    {vaccines.map((vaccine, index) => (
                        <View
                            key={index}
                            className="px-4 py-6 mb-4 flex-row items-center justify-between rounded-2xl border-2 border-[#326F95]"
                        >
                            <MaterialIcons name="vaccines" size={44} color="#0D5175" />
                            <View className="flex-1 px-4">
                                <Text className="font-medium text-xl">{vaccine.name}</Text>
                                <Text className="text-base text-black mt-1">Date: {vaccine.date || "Not stated"} </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveVaccine(index)}
                                className="mr-4" >

                                <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}