import ScreenHeader from "@/components/screen-header";
import { Colors, Sizes } from "@/constants/theme";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { categories, MedicalRecordsCategory } from "../components/mr-search-lists";
import MedicalRecordsSearchModal from "../components/mr-search-modal";

export default function MedicalRecordsSearchScreen() {
    const params = useLocalSearchParams<{ category: MedicalRecordsCategory }>();
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

    const { create } = useCreateMedicalRecord();

    const handleItemPress = async (label: string) => {
        // allergies need no extra details, so save straight away
        if (category === "allergies") {
            try {
                await create({ category: "allergies", item: label });
                router.back();
            } catch (err) {
                console.error("[MedicalRecordsSearchScreen] save failed:", err);
            }
            return;
        }

        setSelectedItem(label);
        setModalVisible(true);
    };
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

    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.bg1 }}>
            <ScreenHeader title={t(`mr-search-history.${currentCategoryConfig.title}`)} />
            <FlatList
                data={processedList}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <View>

                        <View style={{ margin: Sizes.h4, height: Sizes.h2 + Sizes.h4, flexDirection: "row", borderRadius: Sizes.p3, alignItems: "center", borderWidth: 1, borderColor: Colors.secondary, backgroundColor: Colors.bg2, paddingHorizontal: Sizes.h4 }}>
                            <Search size={20} color={Colors.textMuted} />
                            <TextInput
                                placeholder={t("mr-search-history.search")}
                                placeholderTextColor={Colors.textMuted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={{ marginLeft: Sizes.p3, flex: 1, fontSize: Sizes.paragraph, color: Colors.text }}
                            />
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleItemPress(item)}
                        style={{ backgroundColor: Colors.bg2, borderRadius: Sizes.p3, marginHorizontal: Sizes.h4, paddingVertical: Sizes.p2, paddingHorizontal: Sizes.p2, alignItems: "center", flexDirection: "row", marginBottom: Sizes.p2 }}
                    >
                        <View style={{ width: Sizes.boxS, height: Sizes.boxS, alignItems: "center" }}>
                            <MaterialIcons
                                name={currentCategoryConfig.icon}
                                size={44}
                                color={Colors.secondary}
                                style={{ marginTop: Sizes.p0 }}
                            />
                        </View>
                        <Text style={{ marginLeft: Sizes.h4, fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>
                            {t(`mr-search-history.${item}`)}
                        </Text>
                    </TouchableOpacity>

                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", color: Colors.textMuted, marginTop: Sizes.h2 }}>
                        {t(`mr-search-history.sorry`)} {searchQuery} {t(`mr-search-history.noFound`)}
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