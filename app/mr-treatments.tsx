import ScreenHeader from "@/components/screen-header";
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
            setSaveError(error instanceof Error ? error.message : "Failed to save treatment");
        }
    };

    const { t } = useTranslation();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center bg-black/70 px-4">
                    <View className="w-full bg-[#EEF9FB] rounded-3xl p-6 relative">
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute top-4 right-4 z-10 p-1"
                        >
                            <MaterialIcons name="close" size={24} color="#778888" />
                        </TouchableOpacity>

                        <View className="mt-6 mb-4">
                            <Text className="text-[16px] font-regular mb-2 text-black">
                                {t(`mr-treatments.name`)}
                            </Text>
                            <TextInput
                                placeholder={t(`mr-treatments.eg`)}
                                value={treatmentName}
                                onChangeText={setTreatmentName}
                                className="border border-[#0D5175] rounded-xl p-3 bg-white text-[16px] text-black items-center"
                            />
                        </View>

                        <View>
                            <View className="mb-4">
                                <Text className="text-[16px] font-regular mb-2 text-black">
                                    {t(`mr-treatments.query`)}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    className="border border-[#0D5175] rounded-xl p-3 bg-white flex-row justify-between items-center"
                                >
                                    <Text className="text-[16px] text-black">
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

                            <View className="mb-4">
                                <Text className="text-[16px] font-regular mb-2 text-black">
                                    {t(`mr-treatments.query2`)}
                                </Text>
                                <TextInput
                                    placeholder="e.g. 2 pills morning and evening"
                                    value={frequency}
                                    onChangeText={setFrequency}
                                    className="h-[42px] border border-[#0D5175] rounded-xl px-4 py-4 bg-white text-[16px] items-center text-black"
                                />
                            </View>

                        </View>
                        {saveError && <Text className="mb-2 text-red-700">{saveError}</Text>}
                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={submitting}
                                className="h-[50px] bg-[#5085A8] rounded-[14px] content-center justify-center"
                            >
                                <Text className="self-center text-white font-medium text-[16px]">{t(`mr-treatments.add`)}</Text>
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
                setScreenError(createError instanceof Error ? createError.message : "Failed to save treatment");
            });
    }, [create, loading, params.addedTreatment, records, refetch]);

    const handleRemoveTreatment = async (id: string) => {
        setScreenError(null);
        try {
            await deleteRecord(id);
            await refetch();
        } catch (deleteError) {
            setScreenError(deleteError instanceof Error ? deleteError.message : "Failed to delete treatment");
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
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-8 pr-8 pt-12 ">
                    <Text className="text-2xl text-center">{t(`mr-treatments.query3`)}</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-[14px] text-center">{t(`mr-treatments.info`)}</Text>
                </View>
                <View className="flex-1 mx-2 mt-2 mb-20 pt-12" >
                    <TouchableOpacity
                        className="flex-row justify-center bg-[#5085A8] h-[50px] items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={handleOpen}
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-[16px] text-center text-[#fff] font-medium">{t(`mr-treatments.add2`)}</Text>
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
                <Text className="mx-6 mb-4 text-red-700">{screenError ?? error}</Text>
            )}
            {loading && <Text className="mx-6 text-gray-600">Loading treatments...</Text>}

            {records.length > 0 && (

                <View className="mx-6 ">

                    {records.map((record) => (
                        <View
                            key={record.id}
                            className="mt-10 px-2 py-6 mb-4 flex-row items-center justify-between rounded-2xl bg-white">
                            <View className="flex-row ">
                                <MaterialIcons name="medication" size={44} color="#0D5175" className="self-center" />
                                <View className="justify-start mx-8">
                                    <Text className="font-medium text-xl mb-1">
                                        {record.item}
                                    </Text>

                                    <View className="mb-1 flex-row">
                                        <Text className="text-[16px] font-medium text-black">{t(`mr-treatments.started`)} </Text>
                                        <Text className="text-[16px] text-gray-600">{formatDate(record.treatment_date)}</Text>
                                    </View>

                                    <View className="flex-row">
                                        <View className="max-w-[220px]">
                                            <Text className="text-[16px] font-medium text-black">{t(`mr-treatments.frequency`)} </Text>

                                            <Text className="text-[16px] text-gray-600">{record.treatment_frequency ?? ""}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleRemoveTreatment(record.id)}
                                className="mr-4"
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