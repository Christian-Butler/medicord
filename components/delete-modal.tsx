import { signOut } from "@/src/api/auth/api";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type DeleteModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({ visible, onCancel, onConfirm }: DeleteModalProps) {

  const { t } = useTranslation();


  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 justify-center bg-[#B8C8E8]/80 px-8">

        <View className="w-full rounded-2xl border border-[#333] bg-[#EEF4FB] px-4 py-10">
          <Text className="text-center text-[22px] font-semibold text-black">
            {t(`delete-modal.query`)}
          </Text>

          <Text className="mt-4 text-center text-[16px] font-normal text-black">
            {t(`delete-modal.notice`)}
          </Text>

          <Pressable
            onPress={onCancel}
            className="mt-8 mb-2 h-[50px] items-center justify-center rounded-2xl border-[2px] border-[#0D5175] bg-white"
          >
            <Text className="text-[16px] font-medium text-[#0D5175]">
              {t(`delete-modal.stay`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await signOut();
              onConfirm();
              router.replace("/login");
            }}
            className="mt-4 h-[50px] items-center justify-center rounded-2xl bg-[#A81010]"
          >
            <Text className="text-[16px] font-medium text-white">
              {t(`delete-modal.leave`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}