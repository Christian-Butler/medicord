import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type RenewModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

export default function RenewModal({ visible, onConfirm, onClose }: RenewModalProps) {
    const { t } = useTranslation();

    const [reason, setReason] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');


    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.3)",
                paddingHorizontal: Sizes.h2
            }}>
                <View style={{
                    width: "100%",
                    borderRadius: Sizes.h4,
                    backgroundColor: Colors.bg1,
                    paddingHorizontal: Sizes.h2,
                    paddingVertical: Sizes.h1 + Sizes.h3
                }}>
                    <Pressable onPress={onClose} style={{ position: "absolute", right: Sizes.h4, top: Sizes.h4, padding: Sizes.p2 }}>
                        <MaterialIcons name="close" size={22} color={Colors.textMuted} />
                    </Pressable>
                    <View style={{ marginTop: Sizes.p2 }}>
                        <Text style={{ textAlign: "center", fontSize: Sizes.h4, fontWeight: "500", lineHeight: 28, color: Colors.text }}>
                            {t("renew-modal.question")}
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            placeholder={t("renew-modal.reason")}
                            placeholderTextColor={Colors.textMuted}
                            keyboardType="phone-pad"
                            style={{
                                marginTop: Sizes.h1,
                                height: Buttons.height,
                                borderRadius: Sizes.h4,
                                borderWidth: Buttons.w2,
                                borderColor: Colors.textMuted,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.h4,
                                fontSize: Sizes.paragraph,
                                color: Colors.text
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: Sizes.h4 }}>
                        <TextInput
                            value={start}
                            onChangeText={setStart}
                            placeholder={t("renew-modal.start")}
                            placeholderTextColor={Colors.textMuted}
                            keyboardType="phone-pad"
                            style={{
                                height: Buttons.height,
                                width: 160,
                                borderRadius: Sizes.h4,
                                borderWidth: Buttons.w2,
                                borderColor: Colors.textMuted,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.h4,
                                fontSize: Sizes.paragraph,
                                color: Colors.text
                            }}
                        />
                        <TextInput
                            value={end}
                            onChangeText={setEnd}
                            placeholder={t("renew-modal.end")}
                            placeholderTextColor={Colors.textMuted}
                            keyboardType="phone-pad"
                            style={{
                                height: Buttons.height,
                                width: 160,
                                borderRadius: Sizes.h4,
                                borderWidth: Buttons.w2,
                                borderColor: Colors.textMuted,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.h4,
                                fontSize: Sizes.paragraph,
                                color: Colors.text
                            }}
                        />
                    </View>
                    <Pressable
                        onPress={onConfirm}
                        style={{
                            marginTop: Sizes.h1,
                            height: Buttons.height,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: Sizes.p3,
                            backgroundColor: Colors.primary
                        }}
                    >
                        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "600", color: Colors.bg2 }}>{t("renew-modal.askDoctor")}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}