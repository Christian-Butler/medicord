import { Colors, Sizes } from "@/constants/theme";
import { CalendarCheck2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type BookingSuccessOverlayProps = {
  visible: boolean;
  onAddToCalendar: () => void;
  onGoHome: () => void;
};

export default function BookingSuccessOverlay({
  visible,
  onAddToCalendar,
  onGoHome,
}: BookingSuccessOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" />

        <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
          <View className="items-center">
            <View className="mb-8 h-[80px] w-[80px] items-center justify-center">
              <CalendarCheck2 size={Sizes.boxS + 10} color={Colors.secondary} strokeWidth={2} />
            </View>

            <Text className="mb-8 text-center text-[21px] font-medium leading-7 text-black">
              {t(`success-booking.title`)}
            </Text>

            <View className="mb-6 w-full px-3">
              <Text className="mb-3 text-left text-[16px] leading-6 text-black">
                {t(`success-booking.info`)}
              </Text>

              <Text className="text-left text-[16px] leading-6 text-black">
                {t(`success-booking.info2`)}
              </Text>
            </View>

            <Pressable
              onPress={onAddToCalendar}
              className="mb-5 h-[50px] w-full items-center justify-center rounded-[10px] bg-white">
              <Text className="text-[16px] font-medium text-[#07527B]">
                {t(`success-booking.add`)}
              </Text>
            </Pressable>

            <Pressable
              onPress={onGoHome}
              className="h-[50px] w-full items-center justify-center rounded-[10px] bg-[#578EAF]">
              <Text className="text-[16px] font-medium text-white">
                {t(`success-booking.home`)}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
