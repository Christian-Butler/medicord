import { Colors, Sizes } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type ManageMapModalProps = {
    visible: boolean;
    selectedChoice: string | null;
    onToggleChoice: (preference: string) => void;
    onConfirm: () => void;
    onClose?: () => void;
};

const choices = [
    "I accept to share my location.",
    "I refuse to share my location.",
];

export default function ManageMapModal({
    visible,
    selectedChoice,
    onToggleChoice,
    onConfirm,
    onClose,
}: ManageMapModalProps) {

    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
                <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} onPress={onClose} />

                <View style={{ width: "100%", maxWidth: 330, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingVertical: Sizes.h1 + Sizes.h3 }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ marginBottom: Sizes.p2, textAlign: "center", fontSize: Sizes.h3, fontWeight: "600", lineHeight: 28, color: Colors.text }}>{t(`manage-map-modal.title`)}</Text>
                        <Text style={{ marginBottom: Sizes.h1 + Sizes.h2, textAlign: "center", fontSize: Sizes.h4, fontWeight: "500", lineHeight: 28, color: Colors.text }}>
                            {t(`manage-map-modal.query`)}
                        </Text>

                        <View style={{ marginBottom: Sizes.h1 + Sizes.h2, width: "100%", paddingHorizontal: Sizes.h4 }}>
                            {choices.map((choice) => {
                                const selected = selectedChoice === choice;

                                return (
                                    <Pressable
                                        key={choice}
                                        onPress={() => onToggleChoice(choice)}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected }}
                                        style={{ marginBottom: Sizes.h5, flexDirection: "row", alignItems: "center" }}>
                                        <View
                                            style={{ marginRight: Sizes.h1 + Sizes.h2, height: Sizes.h5, width: Sizes.h5, alignItems: "center", justifyContent: "center", borderRadius: Sizes.IconLg, borderWidth: 1, borderColor: selected ? Colors.secondary : Colors.text }}
                                        >
                                            {selected && <View style={{ height: Sizes.p2, width: Sizes.p2, borderRadius: Sizes.IconLg, backgroundColor: Colors.secondary }} />}
                                        </View>

                                        <Text style={{ flex: 1, fontSize: Sizes.sm, color: Colors.text }}>
                                            {t(`manage-map-modal.${choice}`)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable
                            onPress={onConfirm}
                            style={{ height: Sizes.BtnP - Sizes.p1, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.primary }}>
                            <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.bg2 }}>
                                {t(`manage-map-modal.confirm`)}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
