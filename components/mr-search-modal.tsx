import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
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
                                    <Text className="text-base font-medium mb-2 tex-[#000]">When did the surgery happen ?</Text>
                                    <TextInput
                                        placeholder="MM/YYYY"
                                        value={operationDate}
                                        onChangeText={setOperationDate}
                                        className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                    />

                                </View>
                            )}

                            {category === "family_medical_history" && (
                                <View>
                                    <Text className="text-base font-medium mb-2 text-[#000]">When was it diagnosed ?</Text>
                                    <TextInput
                                        placeholder="Family member's age when diagnosed"
                                        value={diagnosis}
                                        onChangeText={setDiagnosis}
                                        className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                    />
                                </View>
                            )}
                            {category === "personal_medical_history" && (
                                <View>
                                    <Text className="text-base font-medium mb-2 text-[#000]">When was it diagnosed ?</Text>
                                    <TextInput
                                        placeholder="MM/YYYY"
                                        value={diagnosisDate}
                                        onChangeText={setDiagnosisDate}
                                        className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                    />
                                    <View className="mt-4 relative z-10">
                                        <Text className="text-base font-medium mb-2 text-[#000]">
                                            What is the current state of the condition?
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => setDropdownVisible((prev) => !prev)}
                                            className="flex-row items-center justify-between border border-[#326F95] rounded-xl p-3 bg-[#fff]"
                                        >
                                            <Text className="text-base text-black">
                                                {conditionState ?? "Select a state"}
                                            </Text>
                                            <MaterialIcons
                                                name={isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                                size={22}
                                                color="#326F95"
                                            />
                                        </TouchableOpacity>

                                        {isDropdownVisible && (
                                            <View className="absolute top-full left-0 right-0 mt-2 bg-[#fff] border border-[#D7E7EE] rounded-xl overflow-hidden shadow-sm z-20">
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
                                                            className="py-3 px-3 border-b border-[#E0E0E0] last:border-b-0"
                                                        >
                                                            <Text className="text-base text-black">{item}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>

                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleSave}
                                className="h-14 bg-[#5085A8] rounded-xl content-center justify-center"
                            >
                                <Text className="self-center text-white font-medium text-base">
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