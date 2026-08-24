import ScreenHeader from "@/components/screen-header";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface TreatmentsModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { treatmentName: string; startDate: string; frequency: string }) => void;
}

function TreatmentsModal({ visible, onClose, onSubmit }: TreatmentsModalProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [treatmentName, setTreatmentName] = useState("");
    const [frequency, setFrequency] = useState("");


    const handleDateChange = (_: DateTimePickerEvent, date?: Date) => {
        setShowPicker(false);
        if (date) {
            setDate(date);
        }
    };

    const handleSave = () => {
        if (!treatmentName.trim()) return;

        onSubmit({
            treatmentName: treatmentName.trim(),
            startDate: date.toLocaleDateString(),
            frequency: frequency.trim(),
        });

        setTreatmentName("");
        setDate(new Date());
        setFrequency("");
        setShowPicker(false);
        onClose();
    };

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
                            <Text className="text-base font-medium mb-1 text-[#000]">
                                Treatment Name
                            </Text>
                            <TextInput
                                placeholder="e.g. Paracetamol"
                                value={treatmentName}
                                onChangeText={setTreatmentName}
                                className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                            />
                        </View>

                        <View>
                            <View className="mb-4">
                                <Text className="text-base font-medium mb-1 text-[#333]">
                                    When did you start taking this treatment?
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    className="border border-[#326F95] rounded-xl p-3 bg-[#fff] flex-row justify-between items-center"
                                >
                                    <Text className="text-base text-[#333]">
                                        {date.toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>

                                {showPicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={"spinner"}
                                        onChange={handleDateChange}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>

                            <View className="mb-4">
                                <Text className="text-base font-medium mb-1 text-[#000]">
                                    How frequently do you take it?
                                </Text>
                                <TextInput
                                    placeholder="e.g. 2 pills morning and evening"
                                    value={frequency}
                                    onChangeText={setFrequency}
                                    className="border border-[#326F95] rounded-xl p-3 bg-[#fff] text-base text-black"
                                />
                            </View>

                        </View>
                        <View className="mt-4">
                            <TouchableOpacity
                                onPress={handleSave}
                                className="h-14 bg-[#5085A8] rounded-xl content-center justify-center"
                            >
                                <Text className="self-center text-white font-medium text-base">Add treatment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )

}
export default function Treatments() {

    const params = useLocalSearchParams<{ addedTreatment?: string }>();
    const [treatmentsList, setTreatmentsList] = useState<string[]>([]);

    useEffect(() => {
        if (params.addedTreatment) {
            setTreatmentsList((prev) => {
                if (!prev.includes(params.addedTreatment!)) {
                    return [...prev, params.addedTreatment!];
                }
                return prev;
            });
        }
    }, [params.addedTreatment]);

    const handleRemoveTreatment = (removeTreatment: string) => {
        setTreatmentsList((prev) => prev.filter((item) => item !== removeTreatment));
    }


    const [modalVisible, setModalVisible] = useState(false);
    const handleOpen = () => setModalVisible(true);
    const handleClose = () => setModalVisible(false);

    const handleSubmit = (data: { treatmentName: string; startDate: string; frequency: string }) => {
        setTreatmentsList((prev) => {
            const name = data.treatmentName.trim();
            if (!name) return prev;
            if (!prev.includes(name)) return [...prev, name];
            return prev;
        });
        console.log("New treatment:", data);
        handleClose();
    };


    return (
        <ScrollView className="bg-[#EEF9FB]">

            <ScreenHeader title='' />

            <View className="m-4">
                <View className="pl-8 pr-8 pt-12 ">
                    <Text className="text-2xl text-center">Is there any treatment you are regularly taking ?</Text>
                </View>
                <View className="pl-4 pr-4 pt-4">
                    <Text className="text-base text-center">Keeping a trace of the treatments you follow reduces oversights and improves medical follow-ups.</Text>
                </View>
                <View className="flex-1 m-2 pt-12" >
                    <TouchableOpacity
                        className="flex-row justify-center bg-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                        onPress={handleOpen}
                    >
                        <MaterialIcons name="add" size={26} color="#fff" />
                        <Text className="text-base text-center text-[#fff] font-medium">Add a treatment</Text>
                    </TouchableOpacity>
                </View>
                {/* 
                <View className="flex-1  m-2 pt-4" >
                    <TouchableOpacity
                        className="flex-1 flex-row justify-center border-2 bg-[#fff] border-[#5085A8] h-14 items-center rounded-2xl"
                        accessibilityRole="button"
                    >
                        <Text className="text-base text-center text-[#5085A8] font-medium">I am not taking any treatment</Text>

                    </TouchableOpacity>
                </View>
                */}
            </View>

            {/*   <View className="mx-4 mt-10 h-0.5 bg-[#BEC9CA] rounded-full" />*/}

            {treatmentsList.length > 0 && (

                <View className="mx-4 mt-20 px-4 py-2 bg-[#E1F9FF] rounded-2xl border-2 border-[#326F95] ">

                    {treatmentsList.map((treatment) => (
                        <View className="my-8 flex-row items-center justify-between">
                            <View className="flex-row">
                                <MaterialIcons name="medication" size={44} color="#0D5175" />
                                <View
                                    key={treatment}
                                    className="justify-start mx-8">
                                    <Text className="font-medium text-xl mb-2">
                                        Treatment
                                    </Text>


                                    <View>
                                        <Text>
                                            {treatment}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleRemoveTreatment(treatment)}
                            >
                                <MaterialIcons name="delete-outline" size={28} color="#D9534F" />
                            </TouchableOpacity>
                        </View>
                    ))}

                </View>
            )}

            <TreatmentsModal
                visible={modalVisible}
                onClose={handleClose}
                onSubmit={handleSubmit}
            />
        </ScrollView>
    );
}