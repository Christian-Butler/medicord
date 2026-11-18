import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";


type InputFieldKey = "smokingOrVaping" | "alcohol" | "physicalActivity" | "professionalActivity";

type InputConfig = {
    icon?: keyof typeof MaterialIcons.glyphMap;
    title: string;
    key: InputFieldKey
};

const inputs: InputConfig[] = [
    { key: "smokingOrVaping", title: "Smoking or vaping", icon: "smoking-rooms" },
    { key: "alcohol", title: "Alcohol", icon: "liquor" },
    { key: "physicalActivity", title: "Physical Activity", icon: "fitness-center" },
    { key: "professionalActivity", title: "Professional activity", icon: "business-center" },

];

type LifestyleModalProps = {
    visible: boolean;
    inputConfig: InputConfig | null;
    firstValue: string;
    onClose: () => void;
    onSubmit: (key: InputFieldKey, value: string) => void;
};

function LifestyleModal({ visible, inputConfig, firstValue, onClose, onSubmit }: LifestyleModalProps) {
    const [value, setValue] = useState(firstValue);

    const { t } = useTranslation();

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
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: Sizes.paragraph }}>
                    <View style={{ width: "100%", backgroundColor: Colors.bg1, borderRadius: Sizes.h2, padding: Sizes.h4, position: "relative" }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ position: "absolute", top: Sizes.h4, right: Sizes.h4, zIndex: 10, padding: Sizes.p1 }}
                        >
                            <MaterialIcons name="close" size={24} color="#778888" />
                        </TouchableOpacity>

                        <View style={{ marginTop: Sizes.h4, marginBottom: Sizes.p2 }}>
                            <Text style={{ fontSize: Sizes.h2, fontWeight: "600", marginBottom: Sizes.p2, color: Colors.text }}>
                                {t(`mr-lifestyle.${inputConfig.title}`)}
                            </Text>
                            <TextInput
                                placeholder={t(`mr-lifestyle.noSpec`)}
                                value={value}
                                onChangeText={setValue}
                                style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text }}
                            />
                        </View>

                        <View style={{ marginTop: Sizes.h5 }}>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={{ height: Buttons.height, backgroundColor: Colors.primary, borderRadius: Sizes.p3, alignItems: "center", justifyContent: "center" }}
                            >
                                <Text style={{ color: Colors.bg2, fontWeight: "500", fontSize: Sizes.paragraph }}>{t(`mr-lifestyle.confirm`)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default function Lifestyle() {
    const [activeInput, setActiveInput] = useState<InputConfig | null>(null);

    const { t } = useTranslation();

    const [formData, setFormData] = useState<Record<InputFieldKey, string>>({
        smokingOrVaping: "",
        alcohol: "",
        physicalActivity: "",
        professionalActivity: "",
    });

    const handleSaveInput = (key: InputFieldKey, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>

            <ScreenHeader title='' />

            <View style={{ margin: Sizes.h4 }}>
                <View style={{ paddingLeft: Sizes.paragraph, paddingTop: Sizes.h4 }}>
                    <Text style={{ fontSize: Sizes.h2, fontWeight: "500", color: Colors.text }}>{t(`mr-lifestyle.title`)}</Text>
                </View>

                {inputs.map((field) => {
                    const value = formData[field.key];

                    return (

                        <View key={field.key} style={{ marginTop: Sizes.h4 }}>
                            <TouchableOpacity
                                onPress={() => setActiveInput(field)}
                                style={{ flexDirection: "row", paddingVertical: Sizes.h2, paddingHorizontal: Sizes.p2, backgroundColor: Colors.bg2, alignItems: "center", borderRadius: Sizes.p3 + Sizes.p1 }}
                                accessibilityRole="button"
                            >
                                <MaterialIcons style={{ padding: Sizes.p2 }} name={field.icon} size={Sizes.IconLg} color={Colors.secondary} />
                                <View>
                                    <Text style={{ marginLeft: Sizes.p2, fontSize: Sizes.h5, fontWeight: "500", color: Colors.text }}>{t(`mr-lifestyle.${field.title}`)}</Text>
                                    <Text style={{ marginLeft: Sizes.p2, marginTop: Sizes.p2, fontSize: Sizes.paragraph, color: Colors.textMuted }}>{value.trim() ? value : t(`mr-lifestyle.noSpec`)}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                    );
                })}
            </View>

            <LifestyleModal
                visible={!!activeInput}
                inputConfig={activeInput}
                firstValue={activeInput ? formData[activeInput.key] : ""}
                onClose={() => setActiveInput(null)}
                onSubmit={handleSaveInput}
            />
        </ScrollView>

    );
}