import { X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

type UpdateAppointmentSuccessOverlayProps = {
  visible: boolean;
  onClose: () => void;
  onViewAppointments: () => void;
};

export default function UpdateAppointmentSuccessOverlay({
  visible,
  onClose,
  onViewAppointments,
}: UpdateAppointmentSuccessOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-end bg-black/30">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full rounded-t-[14px] bg-[#EEF9FB] px-1 pb-12 pt-6">
          <View className="items-stretch">
            <Pressable
              onPress={onClose}
              className="mb-20 h-[44px] w-[56px] self-end items-center justify-center mr-3"
            >
              <X size={32} color="#000" strokeWidth={2} />
            </Pressable>

            <Text className="mx-5 mb-24 text-left text-[30px] font-normal leading-[38px] text-black">
              Your appointment has{"\n"}been updated.
            </Text>

            <Pressable
              onPress={onViewAppointments}
              className="mx-1 h-[66px] items-center justify-center rounded-[16px] bg-[#5085A8]"
            >
              <Text className="text-[22px] font-normal text-white">
                View appointments
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}