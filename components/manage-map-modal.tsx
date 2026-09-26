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
            <View className="flex-1 items-center justify-center bg-black/30 px-6">
                <Pressable className="absolute inset-0" onPress={onClose} />

                <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
                    <View className="items-center">
                        <Text className="mb-2 text-center text-[24px] font-semibold leading-7 text-black">Manage map settings</Text>
                        <Text className="mb-9 text-center text-[20px] font-medium leading-7 text-black">
                            Share your location to find the closest doctors near you ?
                        </Text>

                        <View className="mb-9 w-full px-4">
                            {choices.map((choice) => {
                                const selected = selectedChoice === choice;

                                return (
                                    <Pressable
                                        key={choice}
                                        onPress={() => onToggleChoice(choice)}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected }}
                                        className="mb-5 flex-row items-center">
                                        <View
                                            className={`mr-9 h-5 w-5 items-center justify-center rounded-full border ${selected
                                                ? "border-[#07527B]"
                                                : "border-black"
                                                }`}
                                        >
                                            {selected && <View className="h-2.5 w-2.5 rounded-full bg-[#07527B]" />}
                                        </View>

                                        <Text className="flex-1 text-[14px] text-black">
                                            {t(`manage-map-modal.${choice}`)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        <Pressable
                            onPress={onConfirm}
                            className="h-[46px] w-full items-center justify-center rounded-[10px] bg-[#578EAF]">
                            <Text className="text-[15px] font-medium text-white">
                                Confirm
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
