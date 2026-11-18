import { Colors, Sizes } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type ManageNotificationsModalProps = {
    visible: boolean;
    selectedPreferences: string[];
    onTogglePreference: (preference: string) => void;
    onConfirm: () => void;
    onClose?: () => void;
};

const preferences = [
    "Notifications from doctors, including prescriptions ready, messages.",
    "Notifications from Medicord, including appointment reminders.",
];

export default function ManageNotificationsModal({
    visible,
    selectedPreferences,
    onTogglePreference,
    onConfirm,
    onClose,
}: ManageNotificationsModalProps) {

    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: Sizes.h4 }}>
                <Pressable style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} onPress={onClose} />

                <View style={{ width: "100%", maxWidth: 330, borderRadius: Sizes.h4, backgroundColor: Colors.bg1, paddingHorizontal: Sizes.p3, paddingVertical: Sizes.h1 + Sizes.h3 }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ marginBottom: Sizes.p2, textAlign: "center", fontSize: Sizes.h3, fontWeight: "600", lineHeight: 28, color: Colors.text }}>{t(`manage-notifications-modal.title`)}</Text>
                        <Text style={{ marginBottom: Sizes.h1 + Sizes.h2, textAlign: "center", fontSize: Sizes.h4, fontWeight: "500", lineHeight: 28, color: Colors.text }}>
                            {t(`manage-notifications-modal.choose`)}
                        </Text>

                        <View style={{ marginBottom: Sizes.h1 + Sizes.h2, width: "100%", paddingHorizontal: Sizes.h4 }}>
                            {preferences.map((preference) => {
                                const selected = selectedPreferences.includes(preference);

                                return (
                                    <Pressable
                                        key={preference}
                                        onPress={() => onTogglePreference(preference)}
                                        style={{ marginBottom: Sizes.h5, flexDirection: "row", alignItems: "center" }}>
                                        <View
                                            style={{ marginRight: Sizes.h1 + Sizes.h2, height: Sizes.h5 + 2, width: Sizes.h5 + 2, borderRadius: Sizes.p0, borderWidth: 1, borderColor: selected ? Colors.secondary : Colors.text, backgroundColor: selected ? Colors.secondary : "transparent" }}
                                        />

                                        <Text style={{ flex: 1, fontSize: Sizes.sm, color: Colors.text }}>
                                            {t(`manage-notifications-modal.${preference}`)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable
                            onPress={onConfirm}
                            style={{ height: Sizes.BtnP - Sizes.p1, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: Sizes.p2, backgroundColor: Colors.primary }}>
                            <Text style={{ fontSize: Sizes.sm + 1, fontWeight: "500", color: Colors.bg2 }}>
                                {t(`manage-notifications-modal.confirm`)}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
