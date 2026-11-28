import { Buttons, Colors, Inputs, Sizes } from "@/constants/theme";
import { searchDoctorsByName } from "@/src/api/doctors/api";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export type RenewModalValues = {
    doctorId: string;
    reason: string;
    periodStart: Date | null;
    periodEnd: Date | null;
};

type DoctorSearchResult = {
    id: string;
    full_name: string;
    specialty: string | null;
    avatar_url: string | null;
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

    const [doctorQuery, setDoctorQuery] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorSearchResult | null>(null);
    const [doctors, setDoctors] = useState<DoctorSearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState<DatePickerTarget | null>(null);

    // Start empty each time the modal opens.
    useEffect(() => {
        if (visible) {
            setDoctorQuery("");
            setSelectedDoctor(null);
            setDoctors([]);
            setSearchLoading(false);
            setSearchError(null);
            setReason('');
            setStart(null);
            setEnd(null);
            setShowPicker(null);
        }
    }, [visible]);

    useEffect(() => {
        const query = doctorQuery.trim();

        if (!visible || selectedDoctor || !query) {
            setDoctors([]);
            setSearchError(null);
            setSearchLoading(false);
            return;
        }

        let cancelled = false;
        const timeout = setTimeout(async () => {
            try {
                setSearchLoading(true);
                setSearchError(null);
                const results = await searchDoctorsByName(query);
                if (!cancelled) setDoctors(results as DoctorSearchResult[]);
            } catch {
                if (!cancelled) setSearchError(t("find-doctor.noSearch"));
            } finally {
                if (!cancelled) setSearchLoading(false);
            }
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [doctorQuery, selectedDoctor, t, visible]);

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
                paddingHorizontal: Sizes.h4
            }}>
                <View style={{
                    width: "100%",
                    borderRadius: Sizes.h4,
                    backgroundColor: Colors.bg1,
                    paddingHorizontal: Sizes.h2,
                    paddingVertical: Sizes.h1 + Sizes.h3
                }}>
                    <Pressable onPress={onClose} style={{ position: "absolute", right: Sizes.h4, top: Sizes.h4, padding: Sizes.p2 }}>
                        <MaterialIcons name="close" size={Sizes.h4} color={Colors.textMuted} />
                    </Pressable>
                    <View style={{ marginTop: Sizes.p2 }}>
                        <Text style={{ textAlign: "center", fontSize: Sizes.h4, fontWeight: "500", lineHeight: Sizes.h2, color: Colors.text }}>
                            {t("renew-modal.question")}
                        </Text>
                    </View>
                    <View
                        style={{
                            marginTop: Sizes.h4,
                            height: Inputs.height,
                            borderRadius: Sizes.p3,
                            borderWidth: Inputs.w0,
                            borderColor: Colors.secondary,
                            backgroundColor: Colors.bg2,
                            paddingHorizontal: Sizes.p3,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Search size={Sizes.h4} color={Colors.textMuted} />
                        <TextInput
                            value={doctorQuery}
                            onChangeText={(value) => {
                                setDoctorQuery(value);
                                setSelectedDoctor(null);
                            }}
                            placeholder={t("find-doctor.search")}
                            placeholderTextColor={Colors.textMuted}
                            autoCapitalize="words"
                            returnKeyType="search"
                            style={{
                                flex: 1,
                                marginLeft: Sizes.p0,
                                fontSize: Sizes.paragraph,
                                color: Colors.text
                            }}
                        />
                    </View>
                    {searchLoading ? (
                        <Text style={{ marginTop: Sizes.p0, color: Colors.textMuted }}>
                            {t("find-doctor.searching")}
                        </Text>
                    ) : null}
                    {searchError ? (
                        <Text style={{ marginTop: Sizes.p0, color: Colors.error }}>{searchError}</Text>
                    ) : null}
                    {!searchLoading && !searchError && doctorQuery.trim() && !selectedDoctor && doctors.length === 0 ? (
                        <Text style={{ marginTop: Sizes.p0, color: Colors.textMuted }}>
                            {t("find-doctor.noDoctors")}
                        </Text>
                    ) : null}
                    {doctors.length > 0 && !selectedDoctor ? (
                        <ScrollView style={{ maxHeight: 150, marginTop: Sizes.p0 }}>
                            {doctors.map((doctor) => (
                                <Pressable
                                    key={doctor.id}
                                    onPress={() => {
                                        setSelectedDoctor(doctor);
                                        setDoctorQuery(doctor.full_name);
                                        setDoctors([]);
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: Sizes.p2,
                                        borderRadius: Sizes.p3,
                                        backgroundColor: Colors.bg2
                                    }}
                                >
                                    {doctor.avatar_url ? (
                                        <Image
                                            source={{ uri: doctor.avatar_url }}
                                            style={{ width: Buttons.imgW, height: Buttons.imgW, borderRadius: Buttons.imgW / 2 }}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: Buttons.imgW,
                                                height: Buttons.imgW,
                                                borderRadius: Buttons.imgW / 2,
                                                backgroundColor: Colors.textMuted
                                            }}
                                        />
                                    )}
                                    <View style={{ marginLeft: Sizes.p2 }}>
                                        <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>
                                            {doctor.full_name}
                                        </Text>
                                        <Text style={{ color: Colors.textMuted }}>
                                            {t(`find-doctor.${doctor.specialty ?? "Doctor"}`)}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </ScrollView>
                    ) : null}
                    <View>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            placeholder={t("renew-modal.reason")}
                            placeholderTextColor={Colors.textMuted}
                            style={{
                                marginTop: Sizes.h4,
                                height: Buttons.height,
                                borderRadius: Sizes.p3,
                                borderWidth: Inputs.w0,
                                borderColor: Colors.secondary,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.p3,
                                fontSize: Sizes.paragraph,
                                color: Colors.text
                            }}
                        />
                    </View>
                    <Text>

                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: Sizes.p0 }}>
                        <Pressable
                            onPress={() => setShowPicker((current) => current === "start" ? null : "start")}
                            style={{
                                height: Buttons.height,
                                width: 130,
                                borderRadius: Sizes.p3,
                                borderWidth: Inputs.w0,
                                borderColor: Colors.secondary,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.p3,
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
                                width: 130,
                                borderRadius: Sizes.p3,
                                borderWidth: Inputs.w0,
                                borderColor: Colors.secondary,
                                backgroundColor: Colors.bg2,
                                paddingHorizontal: Sizes.p3,
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
                        onPress={() => {
                            if (selectedDoctor) {
                                onConfirm({ doctorId: selectedDoctor.id, reason, periodStart: start, periodEnd: end });
                            }
                        }}
                        disabled={loading || !selectedDoctor}
                        style={{
                            marginTop: Sizes.h1,
                            height: Buttons.height,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: Sizes.p3,
                            backgroundColor: Colors.primary,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.bg2} />
                        ) : (
                            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.bg2 }}>{t("renew-modal.askDoctor")}</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}