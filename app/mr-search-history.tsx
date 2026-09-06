import ScreenHeader from "@/components/screen-header";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { categories, MedicalRecordsCategory } from "../components/mr-search-lists";
import MedicalRecordsSearchModal from "../components/mr-search-modal";

export default function MedicalRecordsSearchScreen() {
    const params = useLocalSearchParams<{
        category: MedicalRecordsCategory;
        previousAllergies: string[];
        previousOperations?: string;
        previousVaccines?: string;
        previousFamilyHistory?: string;
        previousPersonalHistory?: string;
    }>();

    const category = params.category;
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const currentCategoryConfig = categories[category];

    const processedList = useMemo(() => {
        return [...currentCategoryConfig.items]
            .filter((item) =>
                item.toLowerCase().includes(searchQuery.toLowerCase().trim())
            )
            .sort((a, b) => a.localeCompare(b));
    }, [currentCategoryConfig, searchQuery]);

    const handleItemPress = (label: string) => {
        if (category === "allergies") {
            router.push({
                pathname: "/mr-allergies",
                params: { addedAllergy: label, previousAllergies: params.previousAllergies },
            });
        } else {
            setSelectedItem(label);
            setModalVisible(true);
        }
    };
    const { create, creating, createError } = useCreateMedicalRecord();

    const handleFormSubmit = async (formData: Record<string, string>) => {

        if (category === "family_medical_history") {
            setModalVisible(false);
            router.push({
                pathname: "/mr-family-members",
                params: {
                    item: selectedItem!,
                    diagnosis: formData.diagnosis
                }
            });
            return;
        }

        try {
            await create({
                category,
                item: selectedItem!,
                vaccineDate: formData.vaccineDate ?? null,
                operationDate: formData.operationDate ?? null,
                diagnosis: formData.diagnosis || formData.diagnosisDate || null,
                conditionState: formData.conditionState ?? null,
            });
            setModalVisible(false);
            router.back();
        } catch (err) {
            console.error("[MedicalRecordsSearchScreen] save failed:", err);
        }
    };

    return (
        <View className="flex-1 bg-[#EEF9FB]">
            <ScreenHeader title={currentCategoryConfig.title} />
            <FlatList
                data={processedList}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <View>

                        <View className="mr-6 ml-6 mt-6 mb-6 h-14 flex-row rounded-2xl border-2 items-center border-[#778888] bg-[#fff] px-4">
                            <Search size={20} color="#778888" />
                            <TextInput
                                placeholder="Search"
                                placeholderTextColor="#7B8A91"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className="ml-3 flex-1 text-base text-black"
                            />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleItemPress(item)}
                        className="ml-4 mr-6 items-center flex-row mb-10"
                    >
                        <View className="w-16 h-16 items-center">
                            <MaterialIcons
                                name={currentCategoryConfig.icon}
                                size={44}
                                color="#0D5175"
                                className="mt-1"
                            />
                        </View>
                        <Text className="ml-6 text-base font-medium text-[#333]">
                            {item}
                        </Text>
                    </TouchableOpacity>

                )}
                ListEmptyComponent={
                    <Text className="text-center text-[#7B8A91] mt-8">
                        Sorry, {searchQuery} is not found
                    </Text>
                }
            />


            <MedicalRecordsSearchModal
                visible={modalVisible}
                itemLabel={selectedItem}
                category={category}
                onClose={() => setModalVisible(false)}
                onSubmit={handleFormSubmit}
            />
        </View>
    );
}