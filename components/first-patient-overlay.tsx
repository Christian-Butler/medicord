import { BriefcaseMedical } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

type FirstTimeBookingOverlayProps = {
  visible: boolean;
  onNewPatient: () => void;
  onReturningPatient: () => void;
  onClose?: () => void;
};

export default function FirstTimeBookingOverlay({
  visible,
  onNewPatient,
  onReturningPatient,
  onClose,
}: FirstTimeBookingOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
          <View className="items-center">
            <View className="mb-9 h-[70px] w-[80px] items-center justify-center rounded-[8px] bg-[#2F7298]">
              <BriefcaseMedical size={48} color="white" strokeWidth={3} />
            </View>

            <Text className="mb-10 text-center text-[21px] font-semibold leading-7 text-black">
              Is this your first time{"\n"}booking this practitioner ?
            </Text>

            <Pressable
              onPress={onNewPatient}
              className="mb-6 h-[44px] w-full items-center justify-center rounded-[10px] border-2 border-[#07527B] bg-white">
              <Text className="text-[15px] font-medium text-[#07527B]">
                Yes, I am a new patient
              </Text>
            </Pressable>

            <Pressable
              onPress={onReturningPatient}
              className="h-[46px] w-full items-center justify-center rounded-[10px] bg-[#578EAF]">
              <Text className="text-[15px] font-medium text-white">
                No, I am a returning patient
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
