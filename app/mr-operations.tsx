import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type Operation = {
    name: string;
    date?: string;
};

export default function Operations() {

    const params = useLocalSearchParams<{ addedOperation?: string; previousOperations?: string | string[] }>();

    const [operations, setOperations] = useState<Operation[]>([]);

    useEffect(() => {
        const added = params.addedOperation;
        if (!added) return;

        const rawPrev = params.previousOperations;
        let previous: Operation[] = [];

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
                .filter(Boolean) as Operation[];
        }

        try {
            const newItem = JSON.parse(added) as Operation;
            setOperations(() => {
                const alreadyExists = previous.some((op) => op.name === newItem.name);
                return alreadyExists ? previous : [...previous, newItem];
            });
        } catch {
        }
    }, [params.addedOperation, params.previousOperations]);

    const handleRemoveOperation = (indexToRemove: number) => {
        setOperations((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-6">
                <View className="pt-12 ">
                    <Text className="text-2xl text-center">Have you had medical surgery</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">Keep a trace of or medical surgeries for an improved medical follow-up.</Text>
                </View>
                <View className="flex-1 pt-12" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "operations", previousOperations: JSON.stringify(operations) },
                        })
                        }
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">Add a surgery</Text>

                    </TouchableOpacity>
                </View>
                {/*
                <View className="flex-1 pt-8" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I have not had any surgery</Text>

                    </TouchableOpacity>
                </View>
                */}
            </View>
            {operations.length > 0 && (
                <View className="mt-10 mx-6 mb-10">
                    {operations.map((operation, index) => (
                        <View
                            key={index}
                            className="px-4 py-6 mb-4 flex-row items-center justify-between rounded-2xl border-2 border-[#326F95]"
                        >
                            <MaterialIcons name="healing" size={44} color="#0D5175" />
                            <View className="flex-1 px-4">
                                <Text className="font-medium text-xl">{operation.name}</Text>
                                <Text className="text-base text-black mt-1">Date: {operation.date || "Not stated"}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveOperation(index)}
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