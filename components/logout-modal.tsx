import { signOut } from "@/src/api/auth/api";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type LogoutModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ visible, onCancel, onConfirm }: LogoutModalProps) {

  const { t } = useTranslation();


  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 justify-center bg-[#B8C8E8]/80 px-8">
        <Text className="mb-2 ml-1 text-[15px] font-normal text-[#555]">
          {t(`logout-modal.disconnect`)}
        </Text>

        <View className="w-full rounded-2xl border border-[#333] bg-[#EEF4FB] px-8 py-10">
          <Text className="text-center text-[22px] font-bold text-black">
            {t(`logout-modal.query`)}
          </Text>

          <Text className="mt-4 text-center text-[16px] font-normal text-black">
            {t(`logout-modal.notice`)}
          </Text>

          <Pressable
            onPress={onCancel}
            className="mt-10 h-[56px] items-center justify-center rounded-full border-[2px] border-[#0D5175] bg-white"
          >
            <Text className="text-[16px] font-normal text-[#0D5175]">
              {t(`logout-modal.stay`)}
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await signOut();
              onConfirm();
              router.replace("/login");
            }}
            className="mt-4 h-[56px] items-center justify-center rounded-full bg-[#A81010]"
          >
            <Text className="text-[16px] font-semibold text-white">
              {t(`logout-modal.leave`)}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}