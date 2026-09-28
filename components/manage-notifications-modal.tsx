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
            <View className="flex-1 items-center justify-center bg-black/30 px-6">
                <Pressable className="absolute inset-0" onPress={onClose} />

                <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
                    <View className="items-center">
                        <Text className="mb-2 text-center text-[24px] font-semibold leading-7 text-black">Manage notifications</Text>
                        <Text className="mb-9 text-center text-[20px] font-medium leading-7 text-black">
                            Choose how you prefer to receive communications on the app.
                        </Text>

                        <View className="mb-9 w-full px-4">
                            {preferences.map((preference) => {
                                const selected = selectedPreferences.includes(preference);

                                return (
                                    <Pressable
                                        key={preference}
                                        onPress={() => onTogglePreference(preference)}
                                        className="mb-5 flex-row items-center">
                                        <View
                                            className={`mr-9 h-[18px] w-[18px] rounded-[3px] border ${selected
                                                ? "border-[#07527B] bg-[#07527B]"
                                                : "border-black bg-transparent"
                                                }`}
                                        />

                                        <Text className="flex-1 text-[14px] text-black">
                                            {t(`manage-notifications-modal.${preference}`)}
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
