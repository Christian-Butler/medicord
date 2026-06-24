import { CalendarDays } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

type AppointmentReasonOverlayProps = {
  visible: boolean;
  selectedReasons: string[];
  onToggleReason: (reason: string) => void;
  onConfirm: () => void;
  onClose?: () => void;
};

const reasons = [
  "Regular check-up",
  "Follow up from previous visit.",
  "Chest pains or discomfort",
  "Chronic pain",
  "Other reasons",
];

export default function AppointmentReasonOverlay({
  visible,
  selectedReasons,
  onToggleReason,
  onConfirm,
  onClose,
}: AppointmentReasonOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/30 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full max-w-[330px] rounded-[18px] bg-[#F1FAFB] px-3 py-12">
          <View className="items-center">
            <View className="mb-8 h-[76px] w-[76px] items-center justify-center rounded-[8px] bg-transparent">
              <CalendarDays size={76} color="#2F7298" strokeWidth={2.8} />
            </View>

            <Text className="mb-9 text-center text-[21px] font-semibold leading-7 text-black">
              What are your reasons for{"\n"}an appointment ?
            </Text>

            <View className="mb-9 w-full px-4">
              {reasons.map((reason) => {
                const selected = selectedReasons.includes(reason);

                return (
                  <Pressable
                    key={reason}
                    onPress={() => onToggleReason(reason)}
                    className="mb-5 flex-row items-center">
                    <View
                      className={`mr-9 h-[18px] w-[18px] rounded-[3px] border ${
                        selected
                          ? "border-[#07527B] bg-[#07527B]"
                          : "border-black bg-transparent"
                      }`}
                    />

                    <Text className="flex-1 text-[14px] text-black">
                      {reason}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={onConfirm}
              className="h-[46px] w-full items-center justify-center rounded-[10px] bg-[#578EAF]">
              <Text className="text-[15px] font-medium text-white">
                Confirm reason
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
