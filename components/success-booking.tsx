import { CalendarCheck2 } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

type BookingSuccessOverlayProps = {
  visible: boolean;
  onAddToCalendar: () => void;
  onGoHome: () => void;
  onClose?: () => void;
};

export default function BookingSuccessOverlay({
  visible,
  onAddToCalendar,
  onGoHome,
  onClose,
}: BookingSuccessOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
          <View className="items-center">
            <View className="mb-8 h-[80px] w-[80px] items-center justify-center">
              <CalendarCheck2 size={80} color="#2F7298" strokeWidth={2.8} />
            </View>

            <Text className="mb-8 text-center text-[21px] font-semibold leading-7 text-black">
              Your appointment has been{"\n"}successfully booked !
            </Text>

            <View className="mb-6 w-full px-3">
              <Text className="mb-7 text-left text-[16px] leading-6 text-black">
                By clicking the button below you will be redirected to the
                homepage.
              </Text>

              <Text className="text-left text-[16px] leading-6 text-black">
                Your upcoming appointment has been added there.
              </Text>
            </View>

            <Pressable
              onPress={onAddToCalendar}
              className="mb-5 h-[46px] w-full items-center justify-center rounded-[10px] border-2 border-[#07527B] bg-white">
              <Text className="text-[15px] font-medium text-[#07527B]">
                + Add to calendar
              </Text>
            </Pressable>

            <Pressable
              onPress={onGoHome}
              className="h-[46px] w-full items-center justify-center rounded-[10px] bg-[#578EAF]">
              <Text className="text-[15px] font-medium text-white">
                Take me to the homepage
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
