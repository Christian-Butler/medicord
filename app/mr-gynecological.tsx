import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type InputFieldKey = "contraceptives" | "pregnancy" | "menopause";

type InputConfig = {
    icon?: keyof typeof MaterialIcons.glyphMap;
    title: string;
    key: InputFieldKey
};

const inputs: InputConfig[] = [
    { key: "contraceptives", title: "Contraceptives", icon: "medication" },
    { key: "pregnancy", title: "Pregnancy", icon: "pregnant-woman" },
    { key: "menopause", title: "Menopause", icon: "female" },

];

type GynecologyModalProps = {
    visible: boolean;
    inputConfig: InputConfig | null;
    firstValue: string;
    onClose: () => void;
    onSubmit: (key: InputFieldKey, value: string) => void;
};

function GynecologyModal({ visible, inputConfig, firstValue, onClose, onSubmit }: GynecologyModalProps) {
    const [value, setValue] = useState(firstValue);

    React.useEffect(() => {
        setValue(firstValue);
    }, [firstValue, visible]);

    if (!inputConfig) return null;

    const handleSave = () => {
        onSubmit(inputConfig.key, value);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback>
                <View className="flex-1 justify-center items-center bg-black/70 px-4">
                    <View className="w-full bg-[#EEF9FB] rounded-3xl p-6 relative">
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute top-4 right-4 z-10 p-1"
                        >
                            <MaterialIcons name="close" size={24} color="#778888" />
                        </TouchableOpacity>

                        <View className="mt-6 mb-4">
                            <Text className="text-2xl font-semibold mb-4 text-[#000]">
                                {inputConfig.title}
                            </Text>
                            <TextInput
                                placeholder="Not Specified"
                                value={value}
                                onChangeText={setValue}
                                className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                            />
                        </View>

                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleSave}
                                className="h-14 bg-[#5085A8] rounded-xl content-center justify-center"
                            >
                                <Text className="self-center text-white font-medium text-base">Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default function Gynecology() {
    const [activeInput, setActiveInput] = useState<InputConfig | null>(null);
    const [formData, setFormData] = useState<Record<InputFieldKey, string>>({
        contraceptives: "",
        pregnancy: "",
        menopause: ""
    });

    const handleSaveInput = (key: InputFieldKey, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <ScrollView className="bg-[#EEF9FB] flex-1">

            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-4 pt-6">
                    <Text className="text-2xl font-medium">My gynecological follow-up</Text>
                </View>

                {inputs.map((field) => {
                    const value = formData[field.key];

                    return (

                        <View key={field.key} className="mt-6" >
                            <TouchableOpacity
                                onPress={() => setActiveInput(field)}
                                className="flex-row h-32 border-2 bg-[#E1F9FF] border-[#326F95] items-center rounded-2xl"
                                accessibilityRole="button"
                            >
                                <MaterialIcons className="p-2" name={field.icon} size={48} color="#0D5175" />
                                <View>
                                    <Text className="text-base text-xl font-medium">{field.title}</Text>
                                    <Text className="pt-2 text-base">{value.trim() ? value : "Not specified"}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                    );
                })}
            </View>

            <GynecologyModal
                visible={!!activeInput}
                inputConfig={activeInput}
                firstValue={activeInput ? formData[activeInput.key] : ""}
                onClose={() => setActiveInput(null)}
                onSubmit={handleSaveInput}
            />
        </ScrollView>

    );
}