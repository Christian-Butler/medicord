import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type SecurityConfirmationModalProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

export default function SecurityConfirmationModal({ visible, message, onClose }: SecurityConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/30 px-8">
        <View className="w-full rounded-[18px] bg-white px-6 py-10">
          <Pressable onPress={onClose} className="absolute right-4 top-4 p-2">
            <MaterialIcons name="close" size={22} color="#9BA8AB" />
          </Pressable>

          <Text className="text-center text-[18px] font-medium leading-7 text-black">
            {message}
          </Text>

          <Pressable
            onPress={onClose}
            className="mt-8 h-[52px] items-center justify-center rounded-[14px] bg-[#5085A8]"
          >
            <Text className="text-[16px] font-semibold text-white">I understand</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}