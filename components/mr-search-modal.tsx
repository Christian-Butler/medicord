import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
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
    const [vaccineDate, setVaccineDate] = useState("");
    const [operationDate, setOperationDate] = useState("");
    const [diagnosis, setDiagnosis] = useState("");

    if (!itemLabel) return null;

    const config = categories[category];

    const handleSave = () => {
        onSubmit({
            item: itemLabel,
            vaccineDate,
            operationDate,
            diagnosis,
        });

        setVaccineDate("");
        setOperationDate("");
        setDiagnosis("");
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/70 px-4">
                    <View className="w-full bg-[#EEF9FB] rounded-3xl p-6 relative">
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute top-4 right-4 py-2 px-2"
                        >
                            <MaterialIcons name="close" size={24} color="#778888" />
                        </TouchableOpacity>

                        <View className="flex-row content-center items-center  mb-4">
                            <MaterialIcons name={config.icon} size={32} color="#0D5175" />
                            <Text className="mt-2 text-xl font-medium ml-3 text-[#000]">
                                {itemLabel}
                            </Text>
                        </View>

                        <View className="space-y-4">

                            {category === "vaccines" && (
                                <View>
                                    <Text className=" text-base font-medium mb-2 tex-[#000]">When did you receive this vaccine ?</Text>
                                    <TextInput
                                        placeholder="DD/MM/YYYY"
                                        value={vaccineDate}
                                        onChangeText={setVaccineDate}
                                        className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                    />
                                </View>
                            )}

                            {category === "operations" && (
                                <View>
                                    <Text className="text-base font-medium mb-2 tex-[#000]">When did the surgery haappen ?</Text>
                                    <TextInput
                                        placeholder="MM/YYYY"
                                        value={operationDate}
                                        onChangeText={setOperationDate}
                                        className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                    />

                                </View>
                            )}

                            {category === "medical_history" && (
                                <View>
                                    <Text className="text-base font-medium mb-2 text-[#000]">When was it diagnosed ?</Text>
                                    <TextInput
                                        placeholder="MM/YYYY"
                                        value={diagnosis}
                                        onChangeText={setDiagnosis}
                                        multiline
                                        numberOfLines={3}
                                        className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                    />
                                </View>
                            )}
                        </View>
                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleSave}
                                className="h-14 bg-[#5085A8] rounded-xl content-center justify-center"
                            >
                                <Text className="self-center text-white font-medium text-base">Add to medical records</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}