import { FileText, UserRound } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

type GPOverlayProps = {
  visible: boolean;
  onGoToGpSearch: () => void;
  onContinue: () => void;
  onClose?: () => void;
};

export default function GPOverlay({
  visible,
  onGoToGpSearch,
  onContinue,
  onClose,
}: GPOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
          <View className="items-center">
            <View className="relative mb-7">
              <View className="h-[70px] w-[70px] items-center justify-center rounded-[8px] bg-[#2F7298]">
                <FileText size={46} color="white" strokeWidth={3} />
              </View>

              <View className="absolute -bottom-2 -right-3 h-11 w-11 items-center justify-center rounded-full bg-[#2F7298]">
                <UserRound size={30} color="white" strokeWidth={3} />
              </View>
            </View>

            <Text className="mb-9 text-center text-[22px] font-semibold text-black">
              Read carefully !
            </Text>

            <Text className="mb-10 text-center text-[16px] leading-6 text-black">
              This specialist requires a GP’s note.
            </Text>

            <Pressable
              onPress={onGoToGpSearch}
              className="mb-6 h-[44px] w-full items-center justify-center rounded-[10px] border-2 border-[#07527B] bg-white">
              <Text className="text-[15px] font-medium text-[#07527B]">
                Take me to GP search page
              </Text>
            </Pressable>

            <Pressable
              onPress={onContinue}
              className="h-[46px] w-full items-center justify-center rounded-[10px] bg-[#578EAF]">
              <Text className="text-[15px] font-medium text-white">
                Continue with current booking
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
