import { X } from "lucide-react-native";
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
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full rounded-[14px] bg-[#EEF9FB] px-3 pb-8 pt-5">
          <Pressable
            onPress={onClose}
            disabled={cancelling}
            className="mb-14 h-[44px] w-[44px] self-end items-center justify-center"
          >
            <X size={28} color="#000" strokeWidth={2} />
          </Pressable>

          <Text className="mx-1 mb-14 text-left text-[22px] font-normal leading-[28px] text-black">
            Do you want to postpone or{"\n"}cancel your appointment ?
          </Text>

          <Pressable
            onPress={onPostpone}
            disabled={cancelling}
            className="mb-5 h-[48px] items-center justify-center rounded-[10px] bg-[#5085A8]"
          >
            <Text className="text-[15px] font-normal text-white">
              Postpone my appointment
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancelAppointment}
            disabled={cancelling}
            className={`h-[48px] items-center justify-center rounded-[10px] border-[1.5px] border-[#0D5175] bg-white ${
              cancelling ? "opacity-60" : ""
            }`}
          >
            <Text className="text-[15px] font-normal text-[#0D5175]">
              {cancelling ? "Cancelling..." : "Cancel my appointment"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}