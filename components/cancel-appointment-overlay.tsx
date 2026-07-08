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
      <View className="flex-1 items-center justify-end bg-black/30">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full rounded-t-[14px] bg-[#EEF9FB] px-1 pb-12 pt-6">
          <View className="items-stretch">
            <Pressable
              onPress={onClose}
              disabled={cancelling}
              className="mb-20 h-[44px] w-[56px] self-end items-center justify-center mr-3"
            >
              <X size={32} color="#000" strokeWidth={2} />
            </Pressable>

            <Text className="mx-5 mb-24 text-left text-[30px] font-normal leading-[38px] text-black">
              Do you want to postpone or{"\n"}cancel your appointment ?
            </Text>

            <Pressable
              onPress={onPostpone}
              disabled={cancelling}
              className="mx-1 mb-8 h-[66px] items-center justify-center rounded-[16px] bg-[#5085A8]"
            >
              <Text className="text-[22px] font-normal text-white">
                Postpone my appointment
              </Text>
            </Pressable>

            <Pressable
              onPress={onCancelAppointment}
              disabled={cancelling}
              className={`mx-1 h-[66px] items-center justify-center rounded-[16px] border-[2.5px] border-[#0D5175] bg-white ${
                cancelling ? "opacity-60" : ""
              }`}
            >
              <Text className="text-[22px] font-normal text-[#0D5175]">
                {cancelling ? "Cancelling..." : "Cancel my appointment"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}