import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { categories, MedicalRecordsCategory } from "../components/mr-search-lists";

interface MedicalRecordsSearchModalProps {
    visible: boolean;
    itemLabel: string | null;
    category: MedicalRecordsCategory;
    onClose: () => void;
    onSubmit: (data: Record<string, string>) => void;
}

export default function ItemDetailModal({
    visible,
    itemLabel,
    category,
    onClose,
    onSubmit,
}: MedicalRecordsSearchModalProps) {
    const { t } = useTranslation();
    const [vaccineDate, setVaccineDate] = useState("");
    const [operationDate, setOperationDate] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [diagnosisDate, setDiagnosisDate] = useState("");
    const [conditionState, setConditionState] = useState<string | null>(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    if (!itemLabel) return null;

    const config = categories[category];

    const handleSave = () => {
        onSubmit({
            item: itemLabel,
            vaccineDate,
            operationDate,
            diagnosis,
            diagnosisDate,
            conditionState: conditionState ?? "",
        });

        setVaccineDate("");
        setOperationDate("");
        setDiagnosis("");
        setDiagnosisDate("");
        setConditionState(null);
        onClose();

    };



    const conditionOptions = ["Ongoing", "In remission", "Cured"];


    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: Sizes.paragraph }}>
                    <View style={{ width: "100%", backgroundColor: Colors.bg1, borderRadius: Sizes.h2, padding: Sizes.h4, position: "relative" }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ position: "absolute", top: Sizes.h4, right: Sizes.h4, paddingVertical: Sizes.p2, paddingHorizontal: Sizes.p2 }}
                        >
                            <MaterialIcons name="close" size={24} color={Colors.textMuted} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Sizes.p2 }}>
                            <MaterialIcons name={config.icon} size={32} color={Colors.secondary} />
                            <Text style={{ marginTop: Sizes.p2, fontSize: Sizes.h5, fontWeight: "500", marginLeft: Sizes.p3, color: Colors.text }}>
                                {itemLabel}
                            </Text>
                        </View>

                        <View style={{ gap: Sizes.h5 }}>

                            {category === "vaccines" && (
                                <View>
                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", marginBottom: Sizes.p2, color: Colors.text }}>{t(`mr-search-modal.query`)}</Text>
                                    <TextInput
                                        placeholder={t(`mr-search-modal.place1`)}
                                        value={vaccineDate}
                                        onChangeText={setVaccineDate}
                                        style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text }}
                                    />
                                </View>
                            )}

                            {category === "operations" && (
                                <View>
                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", marginBottom: Sizes.p2, color: Colors.text }}>{t(`mr-search-modal.query2`)}</Text>
                                    <TextInput
                                        placeholder={t(`mr-search-modal.place2`)}
                                        value={operationDate}
                                        onChangeText={setOperationDate}
                                        style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text }}
                                    />

                                </View>
                            )}

                            {category === "family_medical_history" && (
                                <View>
                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", marginBottom: Sizes.p2, color: Colors.text }}>{t(`mr-search-modal.query3`)}</Text>
                                    <TextInput
                                        placeholder={t(`mr-search-modal.place3`)}
                                        value={diagnosis}
                                        onChangeText={setDiagnosis}
                                        style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text }}
                                    />
                                </View>
                            )}
                            {category === "personal_medical_history" && (
                                <View>
                                    <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", marginBottom: Sizes.p2, color: Colors.text }}>{t(`mr-search-modal.query4`)}</Text>
                                    <TextInput
                                        placeholder={t(`mr-search-modal.place4`)}
                                        value={diagnosisDate}
                                        onChangeText={setDiagnosisDate}
                                        style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text }}
                                    />
                                    <View style={{ marginTop: Sizes.h5, position: "relative", zIndex: 10 }}>
                                        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", marginBottom: Sizes.p2, color: Colors.text }}>
                                            {t(`mr-search-modal.query5`)}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => setDropdownVisible((prev) => !prev)}
                                            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2 }}
                                        >
                                            <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>
                                                {conditionState ?? t(`mr-search-modal.select`)}
                                            </Text>
                                            <MaterialIcons
                                                name={isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                size={22}
                                                color={Colors.secondary}
                                            />
                                        </TouchableOpacity>

                                        {isDropdownVisible && (
                                            <View style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: Sizes.p2, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.light.background, borderRadius: Sizes.p3, overflow: "hidden", elevation: 2, zIndex: 20 }}>
                                                <FlatList
                                                    data={conditionOptions}
                                                    keyExtractor={(item) => item}
                                                    scrollEnabled={false}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setConditionState(item);
                                                                setDropdownVisible(false);
                                                            }}
                                                            style={{ paddingVertical: Sizes.p3, paddingHorizontal: Sizes.p3, borderBottomWidth: 1, borderBottomColor: Colors.light.background }}
                                                        >
                                                            <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>{t(`mr-search-modal.${item}`)}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>

                        <View style={{ marginTop: Sizes.h5 }}>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={{ height: Buttons.height, backgroundColor: Colors.primary, borderRadius: Sizes.p3, alignItems: "center", justifyContent: "center" }}
                            >
                                <Text style={{ alignSelf: "center", color: Colors.bg2, fontWeight: "500", fontSize: Sizes.paragraph }}>
                                    Add to medical records
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}