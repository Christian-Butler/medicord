import { Buttons, Colors, Sizes } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";

export type RenewModalValues = {
    reason: string;
    periodStart: Date | null;
    periodEnd: Date | null;
};

type RenewModalProps = {
    visible: boolean;
    loading?: boolean;
    error?: string | null;
    onConfirm: (values: RenewModalValues) => void;
    onClose: () => void;
};

type DatePickerTarget = "start" | "end";

export default function RenewModal({ visible, loading, error, onConfirm, onClose }: RenewModalProps) {
    const { t } = useTranslation();

    const [reason, setReason] = useState('');
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState<DatePickerTarget | null>(null);

    // Start empty each time the modal opens.
    useEffect(() => {
        if (visible) {
            setReason('');
            setStart(null);
            setEnd(null);
            setShowPicker(null);
        }
    }, [visible]);

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "dismissed") {
            setShowPicker(null);
            return;
        }

        if (selectedDate && showPicker === "start") {
            setStart(selectedDate);
            if (end && end < selectedDate) setEnd(selectedDate);
        } else if (selectedDate && showPicker === "end") {
            setEnd(selectedDate);
        }

        if (Platform.OS !== "ios") {
            setShowPicker(null);
        }
    };


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
                        <Pressable
                            onPress={() => setShowPicker((current) => current === "start" ? null : "start")}
                            style={{
                                height: Buttons.height,
                                width: 160,
                                borderRadius: Sizes.h4,
                                borderWidth: Buttons.w2,
                                borderColor: Colors.textMuted,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.h4,
                                justifyContent: "center"
                            }}
                        >
                            <Text style={{ fontSize: Sizes.paragraph, color: start ? Colors.text : Colors.textMuted }}>
                                {start ? start.toLocaleDateString() : t("renew-modal.start")}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setShowPicker((current) => current === "end" ? null : "end")}
                            style={{
                                height: Buttons.height,
                                width: 160,
                                borderRadius: Sizes.h4,
                                borderWidth: Buttons.w2,
                                borderColor: Colors.textMuted,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.h4,
                                justifyContent: "center"
                            }}
                        >
                            <Text style={{ fontSize: Sizes.paragraph, color: end ? Colors.text : Colors.textMuted }}>
                                {end ? end.toLocaleDateString() : t("renew-modal.end")}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        {showPicker === "start" && (
                            <DateTimePicker
                                value={start ?? new Date()}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                        {showPicker === "end" && (
                            <DateTimePicker
                                value={end ?? start ?? new Date()}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                minimumDate={start ?? new Date()}
                            />
                        )}
                    </View>
                    {error ? (
                        <Text style={{ marginTop: Sizes.p2, fontSize: Sizes.paragraph, color: Colors.error }}>{error}</Text>
                    ) : null}
                    <Pressable
                        onPress={() => onConfirm({ reason, periodStart: start, periodEnd: end })}
                        disabled={loading}
                        style={{
                            marginTop: Sizes.h1,
                            height: Buttons.height,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: Sizes.p3,
                            backgroundColor: Colors.primary
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.bg2} />
                        ) : (
                            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "600", color: Colors.bg2 }}>{t("renew-modal.askDoctor")}</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}