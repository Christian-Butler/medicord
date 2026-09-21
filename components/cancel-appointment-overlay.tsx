import { MaterialIcons } from "@expo/vector-icons";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type CancelAppointmentOverlayProps = {
  visible: boolean;
  cancelling?: boolean;
  onClose?: () => void;
  onPostpone: () => void;
  onCancelAppointment: () => void;
};

export default function CancelAppointmentOverlay({
  visible,
  cancelling = false,
  onClose,
  onPostpone,
  onCancelAppointment,
}: CancelAppointmentOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full rounded-[20px] bg-[#EEF9FB] px-3 pb-8 pt-5">
          <Pressable
            onPress={onClose}
            disabled={cancelling}
            className="mb-2 h-[44px] w-[44px] self-end items-center justify-center"
          >
            <X size={28} color="#000" strokeWidth={2} />
          </Pressable>

          <MaterialIcons name="edit-calendar" size={90} color="#326F95"
            className="self-center" />
          <Text className="mx-4 mt-6 mb-14 text-center justify-center text-[20px] font-medium leading-[28px] text-black">
            {t(`cancel-appointment-overlay.query`)}
          </Text>

          <Pressable
            onPress={onPostpone}
            disabled={cancelling}
            className="mb-5 h-[48px] items-center justify-center rounded-[12px] bg-[#5085A8]"
          >
            <Text className="text-[16px] font-medium text-white">
              {t(`cancel-appointment-overlay.post`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancelAppointment}
            disabled={cancelling}
            className={`h-[48px] items-center justify-center rounded-[12px] border-[1.5px] border-[#0D5175] bg-white ${cancelling ? "opacity-60" : ""
              }`}
          >
            <Text className="text-[16px] font-medium text-[#0D5175]">
              {cancelling ? t(`cancel-appointment-overlay.cancelling`) : t(`cancel-appointment-overlay.cancel`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}