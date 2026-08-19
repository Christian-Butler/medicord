import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


export default function Allergies() {
    const params = useLocalSearchParams<{ addedAllergy?: string }>();
    const [allergiesList, setAllergiesList] = useState<string[]>([]);

    useEffect(() => {
        if (params.addedAllergy) {
            setAllergiesList((prev) => {
                if (!prev.includes(params.addedAllergy!)) {
                    return [...prev, params.addedAllergy!];
                }
                return prev;
            });
        }
    }, [params.addedAllergy]);

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

                <View className="flex-1  m-2 pt-12" >
                    <TouchableOpacity
                        className="flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={() => router.push({
                            pathname: "/mr-search-history",
                            params: { category: "allergies" },
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

                <View className="mx-4 mt-20 px-4 py-2 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95] ">

                    {allergiesList.map((allergy) => (
                        <View className="my-8 flex-row items-center justify-between">
                            <View className="flex-row">
                                <MaterialIcons name="gpp-maybe" size={44} color="#0D5175" />
                                <View
                                    key={allergy}
                                    className="justify-start mx-8">
                                    <Text className="font-medium text-xl mb-2">
                                        Allergy
                                    </Text>


                                    <View>
                                        <Text>
                                            {allergy}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveAllergy(allergy)}
                            >
                                <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                            </TouchableOpacity>
                        </View>
                    ))}

                </View>
            )}
        </ScrollView>
    );
}