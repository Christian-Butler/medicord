import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type UpdateAppointmentSuccessOverlayProps = {
  visible: boolean;
  onAddToCalendar?: () => void;
  onViewAppointments: () => void;
};

export default function UpdateAppointmentSuccessOverlay({
  visible,
  onAddToCalendar,
  onViewAppointments,
}: UpdateAppointmentSuccessOverlayProps) {

  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30">
        <View className="w-[92%] rounded-[20px] bg-[#EEF9FB] px-4 pb-8 pt-12">
          <View className="mb-8 items-center">
            <MaterialIcons name="event-available" size={104} color="#2F789E" />
          </View>

          <Text className="mb-12 text-center text-[27px] font-bold leading-[34px] text-black">
            {t(`updated-booking-overlay.title`)}
          </Text>

          <Text className="mb-10 text-left text-[23px] font-normal leading-[31px] text-black">
            {t(`updated-booking-overlay.info`)}
          </Text>

          <Text className="mb-9 text-left text-[23px] font-normal leading-[31px] text-black">
            {t(`updated-booking-overlay.info2`)}
          </Text>

          <Pressable
            onPress={onAddToCalendar}
            className="mb-7 h-[70px] items-center justify-center rounded-[12px] border-[2.5px] border-[#0D5175] bg-white"
          >
            <Text className="text-[22px] font-semibold text-[#0D5175]">
              {t(`updated-booking-overlay.add`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={onViewAppointments}
            className="h-[70px] items-center justify-center rounded-[12px] bg-[#5085A8]"
          >
            <Text className="text-[22px] font-semibold text-white">
              {t(`updated-booking-overlay.view`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}