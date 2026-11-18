import ScreenHeader from "@/components/screen-header";
import { Buttons, Colors, Sizes } from "@/constants/theme";
import { useCreateMedicalRecord } from "@/src/hooks/useCreateMedicalRecord";
import { useDeleteMedicalRecord } from "@/src/hooks/useDeleteMedicalRecord";
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface TreatmentsModalProps {
    visible: boolean;
    submitting: boolean;
    onClose: () => void;
    onSubmit: (data: { treatmentName: string; startDate: string; frequency: string }) => Promise<void>;
}

{/* Seperate modal for internal use only applying to treatments*/ }
function TreatmentsModal({ visible, submitting, onClose, onSubmit }: TreatmentsModalProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [treatmentName, setTreatmentName] = useState("");
    const [frequency, setFrequency] = useState("");
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "dismissed") {
            setShowPicker(false);
            return;
        }

        if (selectedDate) setDate(selectedDate);
        if (Platform.OS !== "ios") setShowPicker(false);
    };

    const handleSave = async () => {
        if (!treatmentName.trim()) return;

        setSaveError(null);
        try {
            await onSubmit({
                treatmentName: treatmentName.trim(),
                startDate: toDateOnly(date),
                frequency: frequency.trim(),
            });

            setTreatmentName("");
            setDate(new Date());
            setFrequency("");
            setShowPicker(false);
            onClose();
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : t("mr-treatments.failedSave"));
        }
    };

    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: Sizes.paragraph }}>
                    <View style={{ width: "100%", backgroundColor: Colors.bg1, borderRadius: Sizes.h2, padding: Sizes.h4, position: "relative" }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ position: "absolute", top: Sizes.h4, right: Sizes.h4, zIndex: 10, padding: Sizes.p1 }}
                        >
                            <MaterialIcons name="close" size={24} color="#778888" />
                        </TouchableOpacity>

                        <View style={{ marginTop: Sizes.h4, marginBottom: Sizes.p2 }}>
                            <Text style={{ fontSize: Sizes.paragraph, marginBottom: Sizes.p2, color: Colors.text }}>
                                {t(`mr-treatments.name`)}
                            </Text>
                            <TextInput
                                placeholder={t(`mr-treatments.eg`)}
                                value={treatmentName}
                                onChangeText={setTreatmentName}
                                style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text, textAlign: "center" }}
                            />
                        </View>

                        <View>
                            <View style={{ marginBottom: Sizes.p2 }}>
                                <Text style={{ fontSize: Sizes.paragraph, marginBottom: Sizes.p2, color: Colors.text }}>
                                    {t(`mr-treatments.query`)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    style={{ borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, padding: Sizes.p3, backgroundColor: Colors.bg2, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <Text style={{ fontSize: Sizes.paragraph, color: Colors.text }}>
                                        {date.toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>

                                {showPicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="spinner"
                                        onChange={handleDateChange}
                                        minimumDate={new Date(1950, 1, 1)}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>

                            <View style={{ marginBottom: Sizes.p2 }}>
                                <Text style={{ fontSize: Sizes.paragraph, marginBottom: Sizes.p2, color: Colors.text }}>
                                    {t(`mr-treatments.query2`)}
                                </Text>
                                <TextInput
                                    placeholder={t("mr-treatments.frequencyPlaceholder")}
                                    value={frequency}
                                    onChangeText={setFrequency}
                                    style={{ height: 42, borderWidth: 1, borderColor: Colors.secondary, borderRadius: Sizes.p3, paddingHorizontal: Sizes.h4, paddingVertical: Sizes.h4, backgroundColor: Colors.bg2, fontSize: Sizes.paragraph, color: Colors.text }}
                                />
                            </View>

                        </View>
                        {saveError && <Text style={{ marginBottom: Sizes.p2, color: Colors.error }}>{saveError}</Text>}
                        <View style={{ marginTop: Sizes.h5 }}>
                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={submitting}
                                style={{ height: Buttons.height, backgroundColor: Colors.primary, borderRadius: Sizes.p3, alignItems: "center", justifyContent: "center" }}
                            >
                                <Text style={{ color: Colors.bg2, fontWeight: "500", fontSize: Sizes.paragraph }}>{t(`mr-treatments.add`)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )

}
function toDateOnly(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

function formatDate(date: string | null): string {
    if (!date) return "";
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
}

export default function Treatments() {

    const { create, creating } = useCreateMedicalRecord();
    const { deleteRecord } = useDeleteMedicalRecord();
    const { records, loading, error, refetch } = useMedicalRecords("treatments");

    const params = useLocalSearchParams<{ addedTreatment?: string }>();
    const handledAddedTreatment = useRef<string | null>(null);
    const [screenError, setScreenError] = useState<string | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        const treatmentName = params.addedTreatment?.trim();
        if (loading || !treatmentName || handledAddedTreatment.current === treatmentName) return;
        handledAddedTreatment.current = treatmentName;
        if (records.some((record) => record.item === treatmentName)) return;

        void create({ category: "treatments", item: treatmentName })
            .then(() => refetch())
            .catch((createError: unknown) => {
                setScreenError(createError instanceof Error ? createError.message : t("mr-treatments.failedSave"));
            });
    }, [create, loading, params.addedTreatment, records, refetch]);

    const handleRemoveTreatment = async (id: string) => {
        setScreenError(null);
        try {
            await deleteRecord(id);
            await refetch();
        } catch (deleteError) {
            setScreenError(deleteError instanceof Error ? deleteError.message : t("mr-treatments.failedDelete"));
        }
    }

    const [modalVisible, setModalVisible] = useState(false);
    const handleOpen = () => setModalVisible(true);
    const handleClose = () => setModalVisible(false);

    const handleSubmit = async (data: { treatmentName: string; startDate: string; frequency: string }) => {
        const name = data.treatmentName.trim();
        if (!name || records.some((record) => record.item === name)) return;

        setScreenError(null);
        await create({
            category: "treatments",
            item: name,
            treatmentDate: data.startDate,
            treatmentFrequency: data.frequency,
        });
        await refetch();
    };


    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bg1 }}>

            <ScreenHeader title='' />

            <View style={{ margin: Sizes.h4 }}>
                <View style={{ paddingHorizontal: Sizes.h2, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <Text style={{ fontSize: Sizes.h2, textAlign: "center", color: Colors.text }}>{t(`mr-treatments.query3`)}</Text>
                </View>
                <View style={{ paddingHorizontal: Sizes.paragraph, paddingTop: Sizes.h5 }}>
                    <Text style={{ fontSize: Sizes.sm, textAlign: "center", color: Colors.text }}>{t(`mr-treatments.info`)}</Text>
                </View>
                <View style={{ flex: 1, marginHorizontal: Sizes.p2, marginTop: Sizes.p2, marginBottom: Sizes.h1 + Sizes.h3, paddingTop: Sizes.h1 + Sizes.h3 }}>
                    <TouchableOpacity
                        style={{ flexDirection: "row", justifyContent: "center", backgroundColor: Colors.primary, height: Buttons.height, alignItems: "center", borderRadius: Sizes.p3 + Sizes.p1 }}
                        accessibilityRole="button"
                        onPress={handleOpen}
                    >
                        <MaterialIcons name="add" size={26} color={Colors.bg2} />
                        <Text style={{ fontSize: Sizes.paragraph, textAlign: "center", color: Colors.bg2, fontWeight: "500" }}>{t(`mr-treatments.add2`)}</Text>
                    </TouchableOpacity>
                </View>
                {/* 
                <View className="flex-1  m-2 pt-4" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-[16px]ase text-center text-[#5085A8] font-medium">I am not taking any treatment</Text>

                    </TouchableOpacity>
                </View>
                */}
            </View>

            {/*   <View className="mx-4 mt-10 h-0.5 bg-[#BEC9CA] rounded-full" />*/}

            {(error || screenError) && (
                <Text style={{ marginHorizontal: Sizes.h4, marginBottom: Sizes.p2, color: Colors.error }}>{screenError ?? error}</Text>
            )}
            {loading && <Text style={{ marginHorizontal: Sizes.h4, color: Colors.textMuted }}>{t("mr-treatments.loading")}</Text>}

            {records.length > 0 && (

                <View style={{ marginHorizontal: Sizes.h4 }}>

                    {records.map((record) => (
                        <View
                            key={record.id}
                            style={{ marginTop: Sizes.h1, paddingHorizontal: Sizes.p2, paddingVertical: Sizes.h2, marginBottom: Sizes.p2, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: Sizes.p3 + Sizes.p1, backgroundColor: Colors.bg2 }}>
                            <View style={{ flexDirection: "row" }}>
                                <MaterialIcons name="medication" size={44} color={Colors.secondary} style={{ alignSelf: "center" }} />
                                <View style={{ justifyContent: "flex-start", marginHorizontal: Sizes.h2 }}>
                                    <Text style={{ fontWeight: "500", fontSize: Sizes.h5, marginBottom: Sizes.p1, color: Colors.text }}>
                                        {record.item}
                                    </Text>

                                    <View style={{ marginBottom: Sizes.p1, flexDirection: "row" }}>
                                        <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-treatments.started`)} </Text>
                                        <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{formatDate(record.treatment_date)}</Text>
                                    </View>

                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ maxWidth: 220 }}>
                                            <Text style={{ fontSize: Sizes.paragraph, fontWeight: "500", color: Colors.text }}>{t(`mr-treatments.frequency`)} </Text>

                                            <Text style={{ fontSize: Sizes.paragraph, color: Colors.textMuted }}>{record.treatment_frequency ?? ""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleRemoveTreatment(record.id)}
                                style={{ marginRight: Sizes.h4 }}
                            >
                                <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                            </TouchableOpacity>
                        </View>
                    ))}

                </View>
            )
            }

            <TreatmentsModal
                visible={modalVisible}
                submitting={creating}
                onClose={handleClose}
                onSubmit={handleSubmit}
            />
        </ScrollView >
    );
}